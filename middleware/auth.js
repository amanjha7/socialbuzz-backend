const jwt = require('jsonwebtoken');
const User = require('../models/userModal');

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if(!token){
    token = req.query.token;
  }

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = protect;
