const express = require("express")
const router = express.Router()
const getCryptoHistory = require("./getCryptoHistory")
const InvestmentHistory = require("../../models/InvestmentHistory")
const asyncWrapper = require("../../asyncWrapper")
const CashTransactions = require("../../models/CashTransactions")

router.route("/:token/:actionType?").post(async function (req, res, next) {
    global.firebaseApp.auth().verifyIdToken(req.params.token)
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
            investmentTotal: "0.00",
            principalInvested: "0.00",
            investmentGains: "0.00",
            topInvestment: {},
            lowestInvestment: {},
            cashTransactions: [],
            yearlyPercentChange: "0.00",
        }
        //generate object map for lookup. keys will be the symbol, and they will 
        //store current object index, and data as values
        //this is to keep lookup times in api calling loop, O(1)
        let storedInvestmentDataMap = {_id: storedInvestmentData._id, userId: decodedToken.uid, crypto:{}, stock:{}}
        for(let i in storedInvestmentData.crypto) storedInvestmentDataMap.crypto[storedInvestmentData.crypto[i].symbol] = {index:i, data: storedInvestmentData.crypto[i].data}
        for(let i in storedInvestmentData.stock) storedInvestmentDataMap.stock[storedInvestmentData.stock[i].symbol] = {index:i, data: storedInvestmentData.stock[i].data}

        //loop through all investments and check if we already have a history of them
        for (let investment of investments){
            switch(investment.investmentType){
                case "crypto":
                    const [continueCrypto, getCryptoError] = await getCryptoHistory(storedInvestmentData, storedInvestmentDataMap, investment, investmentDataChanged, res)
                    if(getCryptoError) return;
                    break;
                case "stock":
                    console.log("stock")
                    break;
                default:
                    return res.send({error: "This investment type is not supported", investmentCause: investment.symbol})
            }
        }
    //calculate and update the rest of the overview variables
    //total Investment Portfolio
        const cryptoInvestmentTotal = storedInvestmentData.crypto.reduce((prev, curr) => prev +  parseFloat(curr.investedAmount), 0) 
        const stockInvestmentTotal = storedInvestmentData.stock.reduce((prev, curr) => prev + parseFloat(curr.investedAmount), 0)
        investmentDataChanged.investmentTotal = (parseFloat(cryptoInvestmentTotal) + parseFloat(stockInvestmentTotal)).toFixed(2)
        storedInvestmentData.investmentTotal = investmentDataChanged.investmentTotal.toString()
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
            for(let i of investments) {
                const transactionProps = {
                    userId: uid,
                    investmentSymbol: i.symbol, 
                    changeBy: i.investedAmount.toString(), 
                    prevBalance: i.prevBalance.toString(), 
                    date: i.dateAdded.date
                }
                const transaction = new CashTransactions(transactionProps)
                newCashTransactions.push(transaction)
                cashTransactions.push(transaction)
                storedInvestmentData.principalInvested = (parseFloat(storedInvestmentData.principalInvested) + parseFloat(transactionProps.changeBy)).toFixed(2) 
            }
            //returns the last 500 items in array
            investmentDataChanged.cashTransactions = cashTransactions.slice(cashTransactions.length - 1000)
        }

    //principal
        investmentDataChanged.principalInvested = storedInvestmentData.principalInvested 

    //lifetime investment gains in USD
        storedInvestmentData.investmentGains = (storedInvestmentData.investmentTotal - storedInvestmentData.principalInvested).toFixed(2).toString()
        investmentDataChanged.investmentGains = storedInvestmentData.investmentGains

    //calculate yearly percent change
        const storedYearlyPercent = storedInvestmentData.yearlyPercentChange
        let startDate = storedYearlyPercent.startDate
        let endDate = storedYearlyPercent.endDate
        let dayDifference = Math.floor((endDate.date - startDate.date) / 86400000)
        // indicates a year has passed so make start Date 
        // principal equal to current investment total
        if(dayDifference > 365 || storedYearlyPercent.startDate.principal === "0.00") {
            storedYearlyPercent.startDate = {date: endDate.date, principal: storedInvestmentData.investmentTotal}
            let yearsDiff = (storedInvestmentData.investmentTotal - storedInvestmentData.principalInvested).toFixed(2).toString()
            storedYearlyPercent.yearsDiff = yearsDiff 
        }
        let newPrincipal = (parseFloat(storedYearlyPercent.yearsDiff) + parseFloat(storedInvestmentData.principalInvested)).toFixed(2).toString()
        storedYearlyPercent.endDate = {date: new Date(), principal: newPrincipal}

        //formula to extract yearly percent change from stored
        let startingBalance = storedYearlyPercent.startDate.principal
        let netDeposits = storedYearlyPercent.endDate.principal - startingBalance
        let adjustedEndingBalance = storedInvestmentData.investmentTotal - netDeposits
        let yearlyReturn = ( (adjustedEndingBalance/startingBalance) - 1 ) * 100
        investmentDataChanged.yearlyPercentChange = yearlyReturn.toFixed(2).toString()
    
    //calculate top and low performing investments
        const checkTopInvestment = (top, low, data, type) => {
            for(let i of data[type]){
                let percentChange =( (i.data[i.data.length-1].close / i.initialValue) -1 ) * 100
                //check if its the highest change
                if(percentChange > parseFloat(top.percentChange) || top.investmentName === ""){
                    top = {
                        investmentType: type,
                        investmentSymbol: i.symbol,
                        investmentName: i.name,
                        percentChange: percentChange.toString(),
                        date: new Date(),
                    }
                }
                //check if its the lowest percent change
                if(percentChange <= parseFloat(low.percentChange) || low.investmentName === ""){
                    low = {
                        investmentType: type,
                        investmentSymbol: i.symbol,
                        investmentName: i.name,
                        percentChange: percentChange.toString(),
                        date: new Date(),
                    }
                }
            }
            console.log(top,low)
            return [top, low]   
        }
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
        return res.send({error: "Something went wrong"})
    });
});

module.exports = router
