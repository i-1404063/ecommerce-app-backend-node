const express = require("express");
const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const auth = require("../middleware/auth");

const router = express.Router();

//auth provides req.user which contains current user information

router.get(
  "/mine",
  [auth],
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    if (orders) {
      res.send(orders);
    } else {
      res.status(404).send({ message: "Orders not found." });
    }
  })
);

router.post(
  "/",
  [auth],
  asyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is Empty. Go Shopping!" });
    } else {
      let order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentInfo,
        itemsPrice: req.body.itemsPrice,
        shippingCost: req.body.shippingCost,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });

      order = await order.save();
      res
        .status(201)
        .send({ message: "Order successfully placed.", orderInfo: order });
    }
  })
);

router.get(
  "/:id",
  [auth],
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    return res.send(order);
  })
);

router.put(
  "/:id/pay",
  [auth],
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      (order.isPaid = true),
        (order.paidAt = Date.now()),
        (order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        });

      const updateOrder = await order.save();
      res.send({ message: "Order Paid", order: updateOrder });
    } else {
      res.status(404).send("Order not Found.");
    }
  })
);

module.exports = router;
