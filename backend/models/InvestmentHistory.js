const mongoose = require('mongoose')
const investmentHistory = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    crypto:[{symbol: String, data:[]}],
    stock: [{symbol: String, data:[]}]
})
const InvestmentHistory = mongoose.model("InvestmentHistory", investmentHistory)
module.exports = InvestmentHistory;