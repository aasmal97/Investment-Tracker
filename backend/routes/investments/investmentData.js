const express = require('express');
const router = express.Router();
// const createUser = require("./createUser") 
// const deleteUser = require("./deleteUser")
const getInvestData = require("./getInvestmentData")
//const updateUser = require("./updateUser")
router.use("/", getInvestData)

module.exports = router;