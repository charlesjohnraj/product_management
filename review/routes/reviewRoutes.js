const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');

const router = express.Router();

router.post('/add', addReview);
router.get('/:productId', getReviews);

module.exports = router;
