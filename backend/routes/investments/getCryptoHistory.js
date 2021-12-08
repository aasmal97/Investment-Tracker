const axios = require('axios')
const asyncWrapper = require("../../asyncWrapper")
const checkApiCall = (storedInvestmentDataMap, investmentType, symbol) => {
    //investment has not once been tracked
    const currHistoryArr = storedInvestmentDataMap[investmentType]
    if(!currHistoryArr || !currHistoryArr[symbol]) return 30  
    //its data is being tracked and stored, but we are still on the same day.
    //determine how many days of data are missing
    const checkKey = currHistoryArr[symbol].data
    const checkLastUpdate = new Date (checkKey[checkKey.length-1].time * 1000)
    const currDate = new Date()
    const dayDifference = Math.floor((currDate - checkLastUpdate) / 86400000)
    return dayDifference===0 ? null : dayDifference
}
const getCryptoHistory = async (storedInvestmentData, storedInvestmentDataMap, investment, changedData, res) =>{
    const symbol = investment.symbol
    const name = investment.name
    const investedAmount = investment.investedAmount
    const dataPointsToRequest = checkApiCall(storedInvestmentDataMap,"crypto", symbol)
    //if no data points missing, dont make an api call (meaning it was recently updated)
    if(!dataPointsToRequest) return ["continue", null];
    const [cryptoData, cryptoError] = await asyncWrapper(
        axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=${dataPointsToRequest}`)
    )
    //only continue if api call succeeded
    if(!cryptoData.data.Data || !cryptoData.data.Data.Data){
        console.error(cryptoError, cryptoData.data? cryptoData.data : null)
        res.send({error: cryptoData.data.Message, investmentCause: symbol})
        return [null,{error: cryptoData.data.Message, investmentCause: symbol}]
    }  

    //add new array values to our database storage
    let coinDataArr = cryptoData.data.Data.Data
    let storedMapCoinData = storedInvestmentDataMap.crypto[symbol]
    //if we are already tracking this investment
    //console.log(storedMapCoinData )
    if(storedMapCoinData){
        const storedCryptoData = storedInvestmentData.crypto[storedMapCoinData.index]
        const prevClosePrice = storedCryptoData.data[storedCryptoData.data.length-1].close
        const prevInvestedAmount = storedCryptoData.investedAmount
        const newInvestAmount = (coinDataArr[coinDataArr.length-1] / prevClosePrice) * prevInvestedAmount
        
        changedData.crypto[symbol] = [...storedMapCoinData.data, ...coinDataArr]
        storedInvestmentData.crypto[storedMapCoinData.index] = {
            ...storedInvestmentData.crypto[storedMapCoinData.index],
            symbol: symbol, 
            data: changedData.crypto[symbol], 
            investedAmount: newInvestAmount,
        }
    }
    //if we arent already tracking this investment
    else{
        changedData.crypto[symbol] = [...coinDataArr],
        storedInvestmentData.crypto.push({name: name, symbol: symbol, data: changedData.crypto[symbol], investedAmount: investedAmount, initialValue: coinDataArr[coinDataArr.length-1].close.toString()})
    }
    return ["continue", null]    
}

module.exports = getCryptoHistory