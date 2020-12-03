const bcrypt = require("bcrypt");

const users = [
  {
    name: "imon",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("12345", bcrypt.genSaltSync(10)),
    isAdmin: true,
  },
];

module.exports = users;
