const express = require("express");
const cors = require("cors")
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv")
const userRoute = require("./routes/user.routes");
const authRoute = require("./routes/auth.routes");
const cartRoute = require("./routes/cart.routes");
const orderRoute = require("./routes/order.routes");
const productRoute = require("./routes/product.routes");
const stripeRoute = require("./routes/stripe.routes")


dotenv.config();

mongoose.connect(
    process.env.MONGO_URL
)
.then(()=>{
    console.log('conexion a base de datos exitosa')
}).catch((error)=>{
    console.log(error)
});

app.use(cors());
app.use(express.json());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/oders", orderRoute);
app.use("/api/v1/products", productRoute);
app.use("api/v1/checkout", stripeRoute)

app.listen(process.env.PORT || 8080,  () => {
    console.log(`servidor corriendo `)
})