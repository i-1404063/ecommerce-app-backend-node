const express = require("express");
const router = express.Router();
const dataProducts = require("../config/data");
const AsyncHandler = require("express-async-handler");
const Product = require("../models/product");

router.get(
  "/",
  AsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);

// router.get(
//   "/seed",
//   AsyncHandler(async (req, res) => {
//     await Product.remove({});
//     const createdProducts = await Product.insertMany(dataProducts);
//     res.send({ createdProducts });
//   })
// );

router.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.status(200).send(product);
    }

    return res
      .status(404)
      .send({ message: "The product with the given id was not found." });
  })
);

module.exports = router;
