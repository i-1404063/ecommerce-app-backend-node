const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.header("x-auth-token");

  if (!auth) {
    return res
      .status(401)
      .send({ message: "Access denied! No token provided." });
  }

  jwt.verify(auth, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).send({ message: "Invalid Token." });
    }

    req.user = decoded;
    next();
  });
};
