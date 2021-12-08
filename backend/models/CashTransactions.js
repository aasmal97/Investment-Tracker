const mongoose = require('mongoose')
const cashTransactions = new mongoose.Schema({
    investmentSymbol: String,
    userId: String,
    changeBy: String, 
    prevBalance: String,
    date: Date
})

const CashTransactions = mongoose.model("CashTransactions", cashTransactions)
module.exports = CashTransactions;