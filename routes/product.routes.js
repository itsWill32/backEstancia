const Product = require("../models/Product.model");
const  {verifyTokenAndAuthorization, verifyTokenAndAdmin}  = require("./verifyToken.routes");

const router = require("express").Router();

//CREATE PRODUCT
router.post("/createProduct", async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);    
    const newProduct = new Product(req.body);
  
    try {
      const savedProduct = await newProduct.save();
      console.log("Producto guardado con éxito:", savedProduct);
      res.status(200).json(savedProduct);
    } catch (err) {
      console.error("Error al guardar el producto:", err); 
      res.status(500).json({ message: "Error al guardar el producto", error: err.message });
    }
  });
  

//UPDATE PRODUCT
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const updateProduct =  await Product.findByIdAndUpdate(req.params.id,
            {
            $set: req.body
        }, {new:true});

        res.status(200).json(updateProduct)
    }catch(err){
        res.status(500).json(err)
    }
});


//DELETE PRODUCT
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Producto eliminado")
    }catch(err){
        res.status(500).json(err)
    }
});


//GET PRODUCTO BY ID
// router.get("/find/:id",  async (req, res) => {
//     try{
//         const Product = await Product.findById(req.params.id);


//         res.status(200).json(Product);

//     }catch(err){
//         res.status(500).json(err)
//     }
// });

router.get("/find/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id); 
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(product);
    } catch (err) {
      console.error("Error al obtener el producto por ID:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

//GET ALL PRODUCTS 
router.get("/allProducts", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try{
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if(qCategory){
            products = await Product.find({
                categories:{
                    $in: [qCategory],
                },
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err)
    }
});



module.exports = router;