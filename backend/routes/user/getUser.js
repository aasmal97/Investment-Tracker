const express = require("express")
const router = express.Router()
const User = require("../../models/User");
// Grab user data after verifiying user login
router.route("/:token").get(async function (req, res, next) {
    global.firebaseApp.auth().verifyIdToken(req.params.token)
    .then(async(decodedToken) =>{
        const uid = decodedToken.uid;
        const userData = await User.findById(uid).exec()
        return res.send(userData)
    })
    .catch((error) => {
        return res.send(error)
    });
});

module.exports = router