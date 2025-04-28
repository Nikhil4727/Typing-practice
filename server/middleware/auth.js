// middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user info on request object - ensure it includes the ID
    req.user = {
      id: decoded.userId || decoded.id, // Handle different token formats
      userId: decoded.userId || decoded.id // For backward compatibility
    };
    
    console.log('Authenticated user:', req.user);
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default auth;