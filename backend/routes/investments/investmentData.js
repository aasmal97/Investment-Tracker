const express = require('express');
const router = express.Router();
// const createUser = require("./createUser") 
//const deleteInvestData = require("./deleteInvestmentHistory")
const getInvestData = require("./getInvestmentHistory")
//const updateUser = require("./updateUser")
router.use("/", getInvestData)

module.exports = router;