const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const User = require("../../models/User");
// This section will help you create a new record.
router.route("/:id").get(async function (req, res, next) {
    if(!req.body.auth) throw Error("Invalid Request. You do not have access")
    const userData = await User.findById(req.body.uid).exec()
    return res.send(userData)
});

module.exports = router