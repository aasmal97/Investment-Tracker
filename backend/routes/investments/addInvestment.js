
const CashTransactions = require("../../models/CashTransactions")

const addInvestments = ({
    investments, 
    storedInvestmentData, 
    cashTransactions,
    uid,
}) =>{
    let newCashTransactions = []
    let localTransactions = [...cashTransactions]
    for(let i of investments) {
        const transactionProps = {
            userId: uid,
            investmentSymbol: i.symbol, 
            changeBy: parseFloat(i.investedAmount).toFixed(2), 
            prevBalance: parseFloat(i.prevBalance).toFixed(2), 
            date: i.dateAdded.date
        }
        const transaction = new CashTransactions(transactionProps)
        newCashTransactions.push(transaction)
        localTransactions.push(transaction)
        storedInvestmentData.principalInvested = (parseFloat(storedInvestmentData.principalInvested) + parseFloat(transactionProps.changeBy))
                                                .toFixed(2) 
    }
    return [localTransactions.slice(localTransactions.length - 500), newCashTransactions, storedInvestmentData.principalInvested]
}
module.exports = addInvestments

