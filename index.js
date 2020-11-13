const path = require("path");
const epxpress = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = epxpress();
dotenv.config({ path: "./config/config.env" }); //loading config files

//database connection
require("./config/db")(mongoose);

//midddleware
app.use(epxpress.json());
app.use(epxpress.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Routes
app.use("/api/users", require("./routes/user")); //users route
app.use("/api/products", require("./routes/product")); //products route
app.use("/api/orders", require("./routes/order")); //order route
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

//Error logger
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server is connected: ", port));
