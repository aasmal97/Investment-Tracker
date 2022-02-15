//loops over every data value once. This can reach up to 1000-5000 at a time.
// benefits from web workers
import pastelColors from "../../utilityFunc/pastelColors"

const parseData = ({
    data, 
    trackedInvestments,
    oldData,
}) =>{
    //generate map of old data
    let cryptoMap = {}
    let stockMap = {}
    let trackedCryptoMap = {}
    let trackedStockMap = {}
    if(oldData){
        for(let investment of oldData) {
            if(investment.investmentType === "stock") stockMap[investment.key] = investment
            if(investment.investmentType === "crypto") cryptoMap[investment.key] = investment
        }
    }
    //generate tracked investment map
    for(let i of trackedInvestments){
        if(i.investmentType === "stock") trackedStockMap[i.symbol] = i
        if(i.investmentType === "crypto") trackedCryptoMap[i.symbol] = i
    }
    const cryptoKeys = data.crypto ? Object.keys(data.crypto) : []
    const stockKeys = data.stock ? Object.keys(data.stock) : []

    function arrayMin(arr) {
        let min = arr[0].close
        for(let i = 1; i<arr.length -1; i++){
            if(arr[i].close < min){
                min = arr[i].close
            }
        }
        return min
    }
    function arrayMax(arr) {
        let max = arr[0].close
        for(let i = 1; i<arr.length -1; i++){
            if(arr[i].close > max){
                max = arr[i].close
            }
        }
        return max
    }
    const cryptoArr = cryptoKeys.map((key) =>{
        const investment = trackedCryptoMap[key]
        //we dont have to loop over all data values if we already have them
        if(cryptoMap[key]){
            return{
                ...cryptoMap[key],
                //replaces with a user defined color
                color: investment && investment.color? investment.color: pastelColors(),
            }
        }
        //filter out empty arrays
        if(data.crypto[key].length === 0) return null
        return{
            key: key,
            values: data.crypto[key],
            investmentType: "crypto", 
            color: investment && investment.color? investment.color: pastelColors(),
            dataMin: arrayMin(data.crypto[key]),
            dataMax: arrayMax(data.crypto[key]),
        } 
    })
    const stockArr = stockKeys.map((key) =>{
        const investment = trackedStockMap[key]


        //we dont have to loop over all data values if we already have them
        if(stockMap[key]){
            return{
                ...stockMap[key],
                //replaces user defined color
                color: investment && investment.color? investment.color: pastelColors(),
            }
        }
        //used to filter out empty arrays
        if(data.crypto[key].length === 0) return null

        return{
            key: key,
            values: data.stock[key],
            investmentType: "stock",
            color: investment && investment.color? investment.color: pastelColors(),
            dataMin: arrayMin(data.stock[key]),
            dataMax: arrayMax(data.stock[key]),
        }
    })
    const filterNull = (value) => value !== null

    return [...stockArr.filter(filterNull), ...cryptoArr.filter(filterNull)]
}
export default parseData