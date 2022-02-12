const mongoose = require('mongoose')
const cashTransactions = new mongoose.Schema({
    investmentSymbol: String,
    userId: String,
    changeBy: Number, 
    prevBalance: Number,
    date: Date
})

const CashTransactions = mongoose.model("CashTransactions", cashTransactions)
module.exports = CashTransactions;