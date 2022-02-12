const checkYearlyPercentChange = (
    storedInvestmentData
) =>{
        //calculate yearly percent change
        const storedYearlyPercent = storedInvestmentData.yearlyPercentChange
        let startDate = storedYearlyPercent.startDate
        let endDate = storedYearlyPercent.endDate
        let dayDifference = Math.floor((endDate.date - startDate.date) / 86400000)
        
            // indicates a year has passed so make start Date 
            // principal equal to current investment total
        if(dayDifference > 365 || storedYearlyPercent.startDate.principal === "0.00") {
            storedYearlyPercent.startDate = {
                date: endDate.date, 
                principal: storedInvestmentData.investmentTotal
            }
            let yearsDiff = (storedInvestmentData.investmentTotal - storedInvestmentData.principalInvested).toFixed(2).toString()
            storedYearlyPercent.yearsDiff = yearsDiff 
        }
        let newPrincipal = (parseFloat(storedYearlyPercent.yearsDiff) + parseFloat(storedInvestmentData.principalInvested))
                            .toFixed(2).toString()
        storedYearlyPercent.endDate = {date: new Date(), principal: newPrincipal}
        let startingBalance = storedYearlyPercent.startDate.principal
        let netDeposits = storedYearlyPercent.endDate.principal - startingBalance
        let adjustedEndingBalance = storedInvestmentData.investmentTotal - netDeposits
        let yearlyReturn = ( (adjustedEndingBalance/startingBalance) - 1 ) * 100

        return [startingBalance, yearlyReturn]
}
module.exports = checkYearlyPercentChange