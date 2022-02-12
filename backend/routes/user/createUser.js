const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const InvestmentHistory = require("../../models/InvestmentHistory")
const asyncWrapper = require("../../asyncWrapper")
const mongoose = require('mongoose')
// This section will help you create a new record.
router.route("/").post(async function (req, res, next) {
    const investmentHistoryId = new mongoose.Types.ObjectId();
    const newUserProps = {
        _id: req.body.uid, 
        investmentHistoryId: investmentHistoryId,
        email: req.body.email,
        metadata: req.body.metadata,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        verifiedEmail: req.body.emailVerified,
        contactSettings: {
            promotional: true, 
            userSpecific: true
        },
        trackedInvestments: [],
    }
    const currDate =  new Date()
    const newInvestmentHistoryProps = {
        _id: investmentHistoryId,
        userId: req.body.uid,
        crypto:[],
        stock:[],
        investmentTotal: 0.00,
        principalInvested: 0.00,
        investmentGains: 0.00,
        topInvestment:{
            investmentType: "",
            investmentName: "",
            investmentSymbol: "",
            date: currDate,
            percentChange: 0.00,
        },
        lowestInvestment:{
            investmentType: "",
            investmentName: "",
            investmentSymbol: "",
            date: currDate,
            percentChange: 0.00,
        },
        yearlyPercentChange:{
            startDate:{
                date: currDate,
                principal: 0.00,
            },
            endDate:{
                date: currDate,
                principal: 0.00,
            },
            yearsDiff: 0.00
        }
    }
    const newInvestmentHistory = new InvestmentHistory(newInvestmentHistoryProps)
    const newUser = new User(newUserProps)
    const saveUser = () =>{
        newInvestmentHistory.save()
        newUser.save()
        const welcomeMessage = `Welcome ${req.body.firstName}, to your investment tracking journey! Congrats on taking the first step to financial independence!`;
        return welcomeMessage
    }

    const [welcomeMessage, error] = await asyncWrapper(saveUser())

    return welcomeMessage ? res.send(welcomeMessage) : res.send(error)
});

module.exports = router