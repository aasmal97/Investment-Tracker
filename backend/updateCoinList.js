//updates our database with new crypto lists every 1st of the month
const axios = require('axios')
const CryptoCoin = require("./models/CryptoCoin")
const nodeSchedule = require('node-schedule');
function updateCoinList(){
    //automatic scheduler to update cryto options every 1st of the month, at 3am
    nodeSchedule.scheduleJob('3 1 * *', async () =>{
        const coinListData = await axios.get("https://min-api.cryptocompare.com/data/all/coinlist")
        const absentListData = await axios.get("https://min-api.cryptocompare.com/data/cccagg/coins/absent")
        if(coinListData.data.Response === "Error" || absentData.data.Response ==="Error") return console.error(coinListData.data.Message)
        const coinData = coinListData.data.Data
        const absentData = absentListData.data.Data
        //grab all coin data listings, and filter out any non-listed coins and update mongodb database
        let coinArr = []
        for (let key of Object.keys(coinData)){
            if(absentData[key]) continue;
            coinArr.push(
                new CryptoCoin({
                    _id: key,
                    name: coinData[key].Name,
                    symbol: coinData[key].Symbol,
                    coinName: coinData[key].CoinName,
                    fullName: coinData[key].FullName, 
                    description: coinData[key].Description
                })
            )
        } 
        return CryptoCoin.insertMany(coinArr,{ ordered: false }).catch(e => console.error(e))
    })
}

module.exports = updateCoinList