const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // bearer token
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({ error: 'Access Denied, No token'});
    }
    
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // 🔥 important

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    
    const userRole = req.user.role;

    if(!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};