const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(401).json({ error: 'Not authorized as admin' });
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};