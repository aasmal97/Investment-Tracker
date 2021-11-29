const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
// This section will help you create a new record.
router.route("/:id").delete(function (req, res) {
    res.send({type:'DELETE'})
});

module.exports = router