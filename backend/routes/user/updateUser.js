const express = require("express")
const router = express.Router()
const User = require("../../models/User");
// Grab user data after verifiying user login
router.route("/:token").put(async function (req, res, next) {
    global.firebaseApp.auth().verifyIdToken(req.params.token)
    .then(async(decodedToken) =>{
        const uid = decodedToken.uid;
        const userData = await User.findById(uid).exec()
        //update all new keys in userData
        Object.keys(req.body).map((key) =>{
            userData[key] = req.body[key]
            return
        })
        await userData.save()
        return res.send(userData)
    })
    .catch((error) => {
        return res.send(error)
    });
});
module.exports = router