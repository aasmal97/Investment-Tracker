
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
    
    return [top, low]   
}
module.exports = checkTopInvestment