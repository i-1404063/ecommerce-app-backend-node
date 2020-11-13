module.exports = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  } else {
    return res.status(403).send({ message: "You are not authorized." });
  }
};
