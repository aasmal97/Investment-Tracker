const express = require("express")
const router = express.Router()
const getCryptoHistory = require("./getCryptoHistory")
const InvestmentHistory = require("../../models/InvestmentHistory")

router.route("/:token/:investments/:actionType?").get(async function (req, res, next) {
    global.firebaseApp.auth().verifyIdToken(req.params.token)
    .then(async(decodedToken) =>{
        const uid = decodedToken.uid
        const investments = JSON.parse(req.params.investments)
        let storedInvestmentData = await InvestmentHistory.findOne({ userId: uid }).exec()
        //keeps track of all investment that are changed
        let investmentDataChanged = {
            _id: storedInvestmentData._id,
            userId: decodedToken.uid,
            crypto: {},
            stock: {}
        }
        //generate map for lookup. keys will be the symbol, and they will 
        //store current object index, and data as values
        //this is to keep lookup times in api calling loop, O(1)
        let storedInvestmentDataMap = {_id: storedInvestmentData._id, userId: decodedToken.uid, crypto:{}, stock:{}}
        for(let i in storedInvestmentData.crypto) storedInvestmentDataMap.crypto[storedInvestmentData.crypto[i].symbol] = {index:i, data: storedInvestmentData.crypto[i].data}
        for(let i in storedInvestmentData.stock) storedInvestmentDataMap.stock[storedInvestmentData.stock[i].symbol] = {index:i, data: storedInvestmentData.stock[i].data}

        //loop through all investments and check if we already have a history of them
        for (let investment of investments){
            switch(investment.investmentType){
                case "crypto":
                    const [continueCrypto, getCryptoError] = await getCryptoHistory(storedInvestmentData, storedInvestmentDataMap, investment.symbol, investmentDataChanged, res)
                    if(getCryptoError) return;
                    break;
                case "stock":
                    console.log("stock")
                    break;
                default:
                    return res.send({error: "This investment type is not supported", investmentCause: investment.symbol})
            }
        }
        if(req.params.actionType !== "initialLoad") return res.send(investmentDataChanged)
        let cryptoMap = {}
        let stockMap = {}
        for(let invest of storedInvestmentData.crypto) cryptoMap[invest.symbol] = invest.data
        for(let invest of storedInvestmentData.stock) stockMap[invest.symbol] = invest.data
        const initialLoadData = {...investmentDataChanged, crypto: {...cryptoMap}, stock: {...stockMap}}

        return res.send(initialLoadData)
    })
    .catch((error) => {
        console.error(error)
        return res.send({error: "Something went wrong"})
    });
});

module.exports = router
