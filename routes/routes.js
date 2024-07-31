const express = require('express');
const { registrationController, loginController, addReviewController, getReviewsController, addReplyController, listProductsController, searchProductsController, addProduct } = require('../controllers/controllers');
const { authMiddleware } = require('../midlewares/midlewares')
const router = express.Router();

router.post('/register', registrationController);
router.post('/login', loginController);
router.post('/reviews', authMiddleware, addReviewController);
router.get('/reviews/:productId', authMiddleware, getReviewsController);
router.post('/reviews/:productId/reply', authMiddleware, addReplyController);
router.get('/search', authMiddleware, listProductsController);
router.get('/search/:productId', authMiddleware, searchProductsController);
router.post('/addProduct',addProduct);


module.exports = router;
