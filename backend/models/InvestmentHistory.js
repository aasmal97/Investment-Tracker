const mongoose = require('mongoose')
const investmentHistory = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    crypto:[{name: String, symbol: String, data:[], investedAmount: Number, initialValue: Number}],
    stock: [{name: String, symbol: String, data:[], investedAmount: Number, initialValue: Number}],
    investmentTotal: Number,
    principalInvested: Number,
    investmentGains: Number,
    topInvestment: {
        investmentType: String,
        investmentName: String,
        investmentSymbol: String,
        date: Date,
        percentChange: Number,
    },
    lowestInvestment: {
        investmentType: String,
        investmentName: String,
        investmentSymbol: String,
        date: Date,
        percentChange: Number
    },
    yearlyPercentChange: {
        startDate:{
            date: Date,
            principal: Number,
        },
        endDate:{
            date: Date,
            principal: Number,
        },
        yearsDiff: Number,
    },
})
const InvestmentHistory = mongoose.model("InvestmentHistory", investmentHistory)
module.exports = InvestmentHistory;