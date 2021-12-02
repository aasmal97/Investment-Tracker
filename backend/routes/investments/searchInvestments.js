const express = require("express")
const router = express.Router()
const CryptoCoin = require("../../models/CryptoCoin")
const asyncWrapper = require("../../asyncWrapper")

router.route("/:token/:type/:keywords").get(async function (req, res, next) {
    switch(req.params.type){
        case "stock":
            global.finnhubClient.symbolSearch(req.params.keywords, (error, data, response) => {
                 if (error) console.error(error)
                 return res.send(data ? data: error.status)
             })
            break;
        case "crypto":
            //we have this data automatically updating, in our own db. Lets search through it
            //and return at most 10 top matches
            [searchResults, error] = await asyncWrapper(
                    CryptoCoin.aggregate().search({
                        index: 'cryptocoins_custom',
                        text: {
                            query: req.params.keywords,
                            path: ["fullName","symbol"]
                        }
                    }).limit(10)
                )

            return searchResults ? res.send(searchResults) : res.send(error)
        default:
            return res.send({status:"Invalid Request"})
    }
});

module.exports = router;