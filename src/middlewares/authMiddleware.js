const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({
      error: "Unauthorized. No token provided.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {

    if (error) {
      return res.status(401).json({
        error: "Unauthorized. Invalid or expired token.",
      });
    }

    req.userId = decoded.id;
    next();
    
  });
};

module.exports = { verifyToken };
