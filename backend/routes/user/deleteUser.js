const express = require("express")
const router = express.Router()
const User = require("../../models/User");

// This section will help you create a new record.
router.route("/:token").delete(async function (req, res, next) {
    global.firebaseApp.auth().verifyIdToken(req.params.token)
    .then(async(decodedToken) =>{
        const uid = decodedToken.uid;
        const userData = await User.findByIdAndDelete(uid).exec()
        return res.send(userData)
    })
    .catch((error) => {
        return res.send(error)
    });
});

module.exports = router