const router = require('express').Router();
const stripe = require("stripe")(process.env.STRIPE_PASSWORD)

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "mxn",
    }, (stripeErr, stripeRes) => {
        if(stripeErr){
            res.status(500).json(stripeErr);
        }else{
            res.status(200).json(stripeRes)
        }
    })
});

module.exports = router;