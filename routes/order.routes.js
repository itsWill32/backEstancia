const router = require("express").Router();
const Order = require("../models/Order.model");
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require("./verifyToken.routes");


//CREATE ORDER
router.post("/createOrder", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    }catch(err){
        res.status(500).json(err)
    }
});

//UPDATE CART
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const updateOrder =  await Cart.findByIdAndUpdate(req.params.id,
            {
            $set: req.body
        }, {new:true});

        res.status(200).json(updateOrder)
    }catch(err){
        res.status(500).json(err)
    }
});


//DELETE CART
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Orden eliminada")
    }catch(err){
        res.status(500).json(err)
    }
});


//GET ORDER CART BY ID
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const orders = await Order.findOne({userId: req.params.userId});

        res.status(200).json(orders);

    }catch(err){
        res.status(500).json(err)
    }
});

//GET ALL ORDERS 
router.get("/allOrders", verifyTokenAndAdmin, async (req, res) => {

    try{
        const orders = await Order.find();

        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err)
    }
});


// STATS MONTHLY 
router.get("/statsMonthly", verifyTokenAndAdmin , async (req, res) =>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1 ));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1 ));

    try{
        const income = await Order.aggregate([
            {$match: { createdAt: { $gte: previousMonth }}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);

        res.status(200).json(income);

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router