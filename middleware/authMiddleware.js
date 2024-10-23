import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

export default authMiddleware;