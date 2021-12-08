const mongoose = require('mongoose')
const investmentHistory = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    crypto:[{name: String, symbol: String, data:[], investedAmount: String, initialValue: String}],
    stock: [{name: String, symbol: String, data:[], investedAmount: String, initialValue: String}],
    investmentTotal: String,
    principalInvested: String,
    investmentGains: String,
    topInvestment: {
        investmentType: String,
        investmentName: String,
        investmentSymbol: String,
        date: Date,
        percentChange: String,
    },
    lowestInvestment: {
        investmentType: String,
        investmentName: String,
        investmentSymbol: String,
        date: Date,
        percentChange: String
    },
    yearlyPercentChange: {
        startDate:{
            date: Date,
            principal: String,
        },
        endDate:{
            date: Date,
            principal: String,
        },
        yearsDiff: String
    },
})
const InvestmentHistory = mongoose.model("InvestmentHistory", investmentHistory)
module.exports = InvestmentHistory;