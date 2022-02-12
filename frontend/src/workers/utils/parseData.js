//loops over every data value once. This can reach up to 1000-5000 at a time.
// benefits from web workers
//generate random pastel colors
import pastelColors from "../../utilityFunc/pastelColors"
const parseData = ({
    data, 
    trackedInvestments
}) =>{
    const cryptoKeys = Object.keys(data.crypto)
    const stockKeys = Object.keys(data.stock)
    const calculateMinMax = (accumulator, currentValue) => {
        return [
            Math.min(currentValue.close, accumulator[0]), 
            Math.max(currentValue.close, accumulator[1])
        ];
    }
    const cryptoArr = cryptoKeys.map((key) =>{
        const investment = trackedInvestments.filter(
            (investment) => key === investment.symbol && investment.investmentType === "crypto"
        )[0]
        const minMax = data.crypto[key].reduce(
            (accumulator, currentValue) => calculateMinMax(accumulator, currentValue) 
            , [Number.MAX_VALUE, Number.MIN_VALUE]
        );
        return{
            key: key,
            values: data.crypto[key],
            investmentType: "crypto", 
            color: investment && investment.color? investment.color: pastelColors(),
            dataMin: minMax[0],
            dataMax: minMax[1]
        } 
    })
    const stockArr = stockKeys.map((key) =>{
        const investment = trackedInvestments.filter(
            (investment) => key === investment.symbol && investment.investmentType === "stock"
        )[0]
        const minMax = data.stock[key].reduce(
            (accumulator, currentValue) => calculateMinMax(accumulator, currentValue) 
        , [Number.MAX_VALUE, Number.MIN_VALUE]
        );
        return{
            key: key,
            values: data.stock[key],
            investmentType: "stock",
            color: investment && investment.color? investment.color: pastelColors(),
            dataMin: minMax[0],
            dataMax: minMax[1]
        }
    })
    return [...stockArr, ...cryptoArr]
}
export default parseData