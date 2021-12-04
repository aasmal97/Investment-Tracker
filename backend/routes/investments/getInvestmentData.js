const express = require("express")
const router = express.Router()
const axios = require('axios')
const asyncWrapper = require("../../asyncWrapper")
router.route("/:token/:selectedInvestments").get(async function (req, res, next) {
    global.firebaseApp.auth().verifyIdToken(req.params.token)
    .then(async(decodedToken) =>{
        const selectedInvestments = JSON.parse(req.params.selectedInvestments)
        let investmentData = {
            crypto:{},
            stock:{}
        }
        
        for (let investment of selectedInvestments){
            switch(investment.investmentType){
                case "crypto":
                    const [cryptoData, cryptoError] = await asyncWrapper(
                        axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${investment.symbol}&tsym=USD&limit=30`)
                    )
                    if(cryptoData.data.Data) {
                        let coinDataArr = cryptoData.data.Data
                        investmentData.crypto[investment.symbol] = coinDataArr
                        //grab closing time values
                        investmentData.crypto[investment.symbol]["currValue"] = coinDataArr.Data[coinDataArr.Data.length-1].close
                    }
                    break;
                case "stock":
                    // const [stockData, stockError] = await asyncWrapper(
                    //     axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${investment.symbol}&tsym=USD&limit=30`)
                    // )
                    // if(stockData.Data) investmentData.stock[investment.symbol] = stockData.Data
                    console.log("stock")
                    break;
                default:
                    break;
            }
        }
        return res.send(investmentData)
    })
    .catch((error) => {
        return res.send(error)
    });
});
  
module.exports = router