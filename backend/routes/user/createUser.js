const express = require("express")
const router = express.Router()
const User = require("../../models/User")

// This section will help you create a new record.
router.route("/").post(async function (req, res, next) {
    const newUserProps = {
        _id: req.body.uid, 
        email: req.body.email,
        metadata: req.body.metadata,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        verifiedEmail: req.body.emailVerified,
        connected_banks: [],
        tracked_investments: []
    }
    const newUser = new User(newUserProps)
    await newUser.save()
    const welcomeMessage = `Welcome ${req.body.firstName}, to your investment tracking journey! Congrats on taking the first step to financial independence!`;
    return res.send(welcomeMessage)
});

module.exports = router