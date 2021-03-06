const express = require("express")
const router = express.Router()
const getCryptoHistory = require("./getCryptoHistory")
const InvestmentHistory = require("../../models/InvestmentHistory")
const asyncWrapper = require("../../asyncWrapper")
const CashTransactions = require("../../models/CashTransactions")
const checkTopInvestment = require("./checkTopInvestment")
const checkYearlyPercentChange = require("./checkYearlyPercentChange")
const addInvestment = require("./addInvestment")
router.route("/:token/:actionType?").post(async function (req, res, next) {
    global.firebaseApp.auth()
    .verifyIdToken(req.params.token)
    .then(async(decodedToken) =>{
        const uid = decodedToken.uid
        const investments = req.body
        let storedInvestmentData = await InvestmentHistory.findOne({ userId: uid }).exec()
        //keeps track of all investment that are changed
        let investmentDataChanged = {
            _id: storedInvestmentData._id,
            userId: uid,
            crypto: {},
            stock: {},
            investmentTotal: 0.00,
            principalInvested: 0.00,
            investmentGains: 0.00,
            topInvestment: {},
            lowestInvestment: {},
            cashTransactions: [],
            yearlyPercentChange: 0.00,
        }
        //generate object map for lookup. keys will be the symbol, and they will 
        //store current object index, and data as values
        //this is to keep lookup times in api calling loop, O(1)
        let storedInvestmentDataMap = {
            _id: storedInvestmentData._id, 
            userId: decodedToken.uid, 
            crypto:{}, 
            stock:{}
        }
        for(let i in storedInvestmentData.crypto) storedInvestmentDataMap.crypto[storedInvestmentData.crypto[i].symbol] = {index:i, data: storedInvestmentData.crypto[i].data}
        for(let i in storedInvestmentData.stock) storedInvestmentDataMap.stock[storedInvestmentData.stock[i].symbol] = {index:i, data: storedInvestmentData.stock[i].data}
        
        //loop through all investments and check if we already have a history of them
        for (let investment of investments){
            switch(investment.investmentType){
                case "crypto":
                    const [continueCrypto, getCryptoError] = await getCryptoHistory(
                                                                        storedInvestmentData, 
                                                                        storedInvestmentDataMap, 
                                                                        investment, 
                                                                        investmentDataChanged, 
                                                                        res
                                                                )
                    if(getCryptoError) return console.error(getCryptoError);
                    break;
                case "stock":
                    console.log("stock")
                    break;
                default:
                    return res.send({
                        error: "This investment type is not supported", 
                        investmentCause: investment.symbol
                    })
            }
        }
        //calculate and update the rest of the overview variables
        //total Investment Portfolio
        const cryptoInvestmentTotal = storedInvestmentData.crypto.reduce((prev, curr) => prev +  parseFloat(curr.investedAmount), 0) 
        const stockInvestmentTotal = storedInvestmentData.stock.reduce((prev, curr) => prev + parseFloat(curr.investedAmount), 0)

        investmentDataChanged.investmentTotal = (parseFloat(cryptoInvestmentTotal) + parseFloat(stockInvestmentTotal)).toFixed(2)
        storedInvestmentData.investmentTotal = investmentDataChanged.investmentTotal
   
        //cash transactions by ascending order
        let [cashTransactions, transactionsError] = await asyncWrapper(CashTransactions.find({userId: uid}).exec())
        if(transactionsError){
            console.error(transactionsError)
            return res.send({error: "Could not fetch transaction information", errorMessage: transactionsError})
        }
        cashTransactions = cashTransactions.sort((a, b) => a.date - b.date)

        //add new cash transactions if needed
        //adjust investment principals
        let newCashTransactions = []
        if(req.params.actionType === "addInvestment") {
            const [transactions, newlyCreatedTransactions , principalInvested] = addInvestment({
                investments: investments,
                storedInvestmentData: storedInvestmentData,
                uid: uid,
                cashTransactions: cashTransactions
            })
            storedInvestmentData.principalInvested = principalInvested
            //returns the last 500 items in array
            investmentDataChanged.cashTransactions = transactions
            newCashTransactions = newlyCreatedTransactions
        }

        //principal
        investmentDataChanged.principalInvested = storedInvestmentData.principalInvested 

        //lifetime investment gains in USD
        storedInvestmentData.investmentGains = (storedInvestmentData.investmentTotal - storedInvestmentData.principalInvested)
                                                .toFixed(2).toString()
        investmentDataChanged.investmentGains = storedInvestmentData.investmentGains
        
        //calculate yearly percent change
        const [startingBalance, yearlyReturn] = checkYearlyPercentChange(storedInvestmentData)
        if(startingBalance === "0.00" || "0" || 0) investmentDataChanged.yearlyPercentChange = 0
        else investmentDataChanged.yearlyPercentChange = yearlyReturn.toFixed(2).toString()
    
        //calculate lowest and top investments
        let topInvestment = storedInvestmentData.topInvestment
        let lowestInvestment = storedInvestmentData.lowestInvestment
        if(req.params.actionType === "initialLoad"){
            [topInvestment, lowestInvestment] = checkTopInvestment(topInvestment, lowestInvestment, storedInvestmentData, "crypto")
            [topInvestment, lowestInvestment] = checkTopInvestment(topInvestment, lowestInvestment, storedInvestmentData, "stock")
        }

        storedInvestmentData.topInvestment = topInvestment
        investmentDataChanged.topInvestment = topInvestment
        storedInvestmentData.lowestInvestment = lowestInvestment
        investmentDataChanged.lowestInvestment = lowestInvestment

        if(isNaN(storedInvestmentData.investmentTotal)) return res.send({
            error: "Invalid Investment Total", 
            errorMessage: "Invalid Investment Total"
        })
        if(isNaN(storedInvestmentData.principalInvested)) return res.send({
            error: "Invalid Principal Total", 
            errorMessage: "Invalid Principal Total"
        })
        //save all document changes to database
        const [saveSuccess, saveError] = await asyncWrapper(storedInvestmentData.save())
        if(saveError){
            //handle error
            console.error(saveError)
            res.send({error: "We could not update your investment data", investmentCause: null})
            return [null, {error: "We could not update your investment data", investmentCause: null}]
        } 
        if(req.params.actionType === "addInvestment") {
            const [cashTransactionsSuccess, cashTransactionsError] = await asyncWrapper(CashTransactions.insertMany(newCashTransactions))
            if(cashTransactionsError){
                //handle error
                console.error(saveError)
                res.send({error: "We could not update your transactions", investmentCause: null})
                return [null, {error: "We could not update your transactions", investmentCause: null}]
            }
        }
    //send appropriate processed data to client
        if(req.params.actionType !== "initialLoad") return res.send(investmentDataChanged)
        let initialLoadData = {...investmentDataChanged, crypto: {},stock: {}}
        let cryptoMap = initialLoadData.crypto
        let stockMap = initialLoadData.stock
        for(let invest of storedInvestmentData.crypto) cryptoMap[invest.symbol] = invest.data
        for(let invest of storedInvestmentData.stock) stockMap[invest.symbol] = invest.data
        return res.send(initialLoadData)
    })
    .catch((error) => {
        console.error(error)
        return res.send({error: "This token is invalid"})
    });
});

module.exports = router
