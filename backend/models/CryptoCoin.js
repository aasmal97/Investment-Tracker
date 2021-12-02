const mongoose = require("mongoose");
const cryptoCoin = new mongoose.Schema({
    _id: String,
    name: String,
    symbol: String,
    coinName: String,
    fullName: String, 
    description: String
})
const CryptoCoin = mongoose.model("CryptoCoin", cryptoCoin)
module.exports = CryptoCoin;

