const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
  next();
};
const authorizeStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access Denied: Students Only" });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin, authorizeStudent };
