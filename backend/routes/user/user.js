const express = require('express');
const router = express.Router();
const createUser = require("./createUser") 
const deleteUser = require("./deleteUser")
const getUser = require("./getUser")
const updateUser = require("./updateUser")
router.use("/", createUser, deleteUser, getUser, updateUser)

module.exports = router;