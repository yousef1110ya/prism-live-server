// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * this middleware will decode the jwt token 
 * 1- will not save the user to a scheme 
 * 2- will add the streamer info to the request 
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  let decoded; 
  let user;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded payload:', decoded);
  } catch (err) {
    console.error('Invalid token:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
  const streamer = {
    streamerName: decoded.name,
    streamerId: parseInt(decoded.sub, 10),
    streamerImage: decoded.avatar,
  };
    // Attach user to request
    req.streamer = streamer;
    next();
  
};

module.exports = authMiddleware;
