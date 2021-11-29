const mongoose = require("mongoose");
const users = new mongoose.Schema({
    _id: String,
    email: String,
    firstName: String,
    lastName: String,
    tracked_investments: [{name: String, last_tracked_date: Date, abbreviation: String, invested_amount:Number}],
    connected_banks: [String],
    contact_settings: [String],
    metadata: {
        type: Map,
        of: String
    },
    verifiedEmail: Boolean,
})
const User = mongoose.model("User", users)
module.exports = User;