const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const asyncWrapper = require("../../asyncWrapper")
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
        tracked_investments: [],
        contact_settings: []
    }
    const newUser = new User(newUserProps)
    const saveUser = () =>{
        newUser.save()
        const welcomeMessage = `Welcome ${req.body.firstName}, to your investment tracking journey! Congrats on taking the first step to financial independence!`;
        return welcomeMessage
    }

    const [welcomeMessage, error] = await asyncWrapper(saveUser())
    
    return welcomeMessage ? res.send(welcomeMessage) : res.send(error)
});

module.exports = router