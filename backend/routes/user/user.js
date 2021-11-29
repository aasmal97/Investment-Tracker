const express = require('express');
const router = express.Router();
const createUser = require("./createUser") 
const deleteUser = require("./deleteUser")
const getUser = require("./getUser")

router.use("/", createUser, deleteUser, getUser)

module.exports = router;