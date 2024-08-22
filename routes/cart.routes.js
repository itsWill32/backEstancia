const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken.routes");
const Cart = require("../models/Cart.model");
const router = require("express").Router();


//CREATE CART
router.post("/createCart", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }
});

//UPDATE CART
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) =>{
    try{
        const updateCart =  await Cart.findByIdAndUpdate(req.params.id,
            {
            $set: req.body
        }, {new:true});

        res.status(200).json(updateCart)
    }catch(err){
        res.status(500).json(err)
    }
});


//DELETE CART
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Carrito eliminado")
    }catch(err){
        res.status(500).json(err)
    }
});


//GET USER CART BY ID
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const Cart = await Cart.findOne({userId: req.params.userId});

        res.status(200).json(Cart);

    }catch(err){
        res.status(500).json(err)
    }
});

//GET ALL CARTS 
router.get("/allCarts", verifyTokenAndAdmin, async (req, res) => {

    try{
        const carts = await Cart.find();

        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err)
    }
});


module.exports = router