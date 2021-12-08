const mongoose = require("mongoose");
const users = new mongoose.Schema({
    _id: String,
    email: String,
    firstName: String,
    lastName: String,
    verifiedEmail: Boolean,
    investmentHistoryId: mongoose.Schema.Types.ObjectId,
    contactSettings: {type: Map, of:Boolean},
    metadata: {
        type: Map,
        of: String
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