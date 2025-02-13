const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token sağlanmadı veya geçersiz.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token süresi doldu.",
        });
      }
      return res.status(403).json({
        success: false,
        message: "Token geçersiz.",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
