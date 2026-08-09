const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Header mein "Authorization: Bearer <token>" format check karo
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Token verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Decoded data (user id, role) request mein attach karo
      req.user = decoded;

      next(); // Sab sahi hai, aage badho
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;