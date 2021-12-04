const express = require("express")
const router = express.Router()
const User = require("../../models/User");
// Grab user data after verifiying user login
router.route("/:token").put(async function (req, res, next) {
    global.firebaseApp.auth().verifyIdToken(req.params.token)
    .then(async(decodedToken) =>{
        const uid = decodedToken.uid;
        //delete token field. The request has been authenticated
        delete req.body.token 
        //update fields
        User.findOneAndUpdate({ "_id": uid }, { "$set": {...req.body} }).exec(
            async function (err, user) {
                const userData = await User.findById(uid)
                return res.send(userData)
            }
        );
    })
    .catch((error) => res.send(error));
});
module.exports = router
