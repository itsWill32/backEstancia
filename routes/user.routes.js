const User = require("../models/User.model");
const  {verifyTokenAndAuthorization, verifyTokenAndAdmin}  = require("./verifyToken.routes");

const router = require("express").Router();

//EDIT USER
router.put("/edit/:id", verifyTokenAndAuthorization, async (req, res) =>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password , process.env.SECRET_PASSWORD).toString();

    }

    try{
        const updateUser =  await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, {new:true});

        res.status(200).json(updateUser)
    }catch(err){
        res.status(500).json(err)
    }
});


//DELETE USER
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("usuario borrado")
    }catch(err){
        res.status(500).json(err)
    }
});


//GET USER BY ID
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        const {password, ...others} = user._doc;

        res.status(200).json(others);

    }catch(err){
        res.status(500).json(err)
    }
});

//GET ALL USERS 
router.get("/allUsers", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try{
        const users = query ? await User.find().sort({_id:-1}).limit(1) : await User.find();

        res.status(200).json(users);

    }catch(err){
        res.status(500).json(err)
    }
});


//STATS USERS 
router.get("/stats", async (req, res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1 ));

    try{
        const data = await User.aggregate([
            {$match: { createdAt: { $gte: lastYear }}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;