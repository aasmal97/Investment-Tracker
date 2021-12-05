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
const getCryptoHistory = async (storedInvestmentData, storedInvestmentDataMap, symbol, changedData, res) =>{
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

    if(storedMapCoinData){
        changedData.crypto[symbol] = [...storedMapCoinData, ...coinDataArr]
        storedInvestmentData.crypto[storedMapCoinData.index] = {symbol: symbol, data: changedData.crypto[symbol]}
    }
    else{
        changedData.crypto[symbol] = [...coinDataArr],
        storedInvestmentData.crypto.push({symbol: symbol, data: changedData.crypto[symbol]})
    }
    
    const [saveSuccess, saveError] = await asyncWrapper(storedInvestmentData.save())
 
    if(!saveError) return ["continue", null];
    console.error(saveError)
    res.send({error: "Could not save this investment", investmentCause: symbol})
    return [null, {error: "Could not save this investment", investmentCause: symbol}]
}

module.exports = getCryptoHistory