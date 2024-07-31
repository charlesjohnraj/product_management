const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // const token = req?.header('Authorization').replace('Bearer ', '');
  const token = req?.header('Authorization');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

module.exports = {authMiddleware};