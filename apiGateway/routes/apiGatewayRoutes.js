const express = require('express');
const proxy = require('express-http-proxy');

const router = express.Router();

router.use('/auth', proxy('http://localhost:8000'));
router.use('/search', proxy('http://localhost:6000'));
router.use('/reviews', proxy('http://localhost:7000'));

module.exports = router;