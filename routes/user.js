const express = require("express");
const User = require("../models/user");
const AsyncHandler = require("express-async-handler");
// const users = require("../config/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require("mongoose");

const router = express.Router();

// router.get(
//   "/seed",
//   AsyncHandler(async (req, res) => {
//     // await User.remove({});
//     const createdUsers = await User.insertMany(users);
//     res.send({ createdUsers });
//   })
// );

router.get(
  "/:id",
  [auth],
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found." });
    }
  })
);

router.post(
  "/signin",
  AsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = user.generateToken();

      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send(token);
      } else {
        res.status(401).send({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).send({ message: "Invalid email or password." });
    }
  })
);

router.post(
  "/signup",
  AsyncHandler(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      res.status(401).send({ message: "User already exist." });
    } else {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
      });

      user = await user.save();
      const token = user.generateToken();
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .status(200)
        .send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
    }
  })
);

router.put(
  "/profile",
  [auth],
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password =
          bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) ||
          user.password;
      }

      const newUser = await user.save();
      const token = newUser.generateToken();
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .status(200)
        .send(_.pick(newUser, ["_id", "name", "email", "isAdmin"]));
    }
  })
);

router.put(
  "/:id",
  [auth],
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      (user.name = req.body.name), (user.email = req.body.email);

      const newUser = await user.save();
      return res.send({ message: "Successfully updated.", user: newUser });
    }

    return res.send({ message: "Sorry! Could not update." });
  })
);

module.exports = router;
