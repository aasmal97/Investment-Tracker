const mongoose = require("mongoose");
const users = new mongoose.Schema({
    _id: String,
    email: String,
    firstName: String,
    lastName: String,
    verifiedEmail: Boolean,
    contactSettings: {type: Map, of:Boolean},
    cashTransactions: [{
        changeBy: String, 
        prevBalance: String}],
    metadata: {
        type: Map,
        of: String
    },
    topInvestment: {
        type:Map,
        of: {
            investmentType: String,
            date: Date,
            investmentName: String
        }
    },
    yearlyPercentChange: {
        type: Map,
        of:{
            date: Date,
            investmentsOwned: [{
                date: Date, 
                investmentsOwned:[{name: String, investmentType: String}]
            }]
        }
    },
    trackedInvestments: [{
        investmentType: String,
        name: String, 
        lastViewed: Date, 
        symbol: String, 
        investedAmount: String, 
        dateAdded:{
            date: Date, 
            value: String
        }
    }],
})

const User = mongoose.model("User", users)
module.exports = User;