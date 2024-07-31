const { registrationController, loginController, addReviewController, getReviewsController, listProductsController, searchProductsController, addReplyController, addProduct } = require('../controllers/controllers');
const { User, Review, Product } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Controller Tests', () => {

  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('registrationController', () => {
    it('should register a new user', async () => {
      req.body = { username: 'testuser', password: 'password', email: 'test@example.com' };
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue({});

      await registrationController(req, res, next);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('User registered');
    });

    it('should handle errors during registration', async () => {
      req.body = { username: 'testuser', password: 'password', email: 'test@example.com' };
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Error'));

      await registrationController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error adding user');
    });
  });

  describe('loginController', () => {
    it('should login a user with valid credentials', async () => {
      req.body = { username: 'testuser', password: 'password' };
      const user = { _id: '123', password: 'hashedPassword' };
      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      await loginController(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ id: '123' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should handle invalid credentials', async () => {
      req.body = { username: 'testuser', password: 'password' };
      User.findOne = jest.fn().mockResolvedValue(null);

      await loginController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('addReviewController', () => {
    it('should add a new review', async () => {
      req.body = { productId: '123', username: 'testuser', rating: 5, comment: 'Great product!' };
      Review.prototype.save = jest.fn().mockResolvedValue({});

      await addReviewController(req, res, next);

      expect(Review.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Review added');
    });

    it('should handle errors during adding a review', async () => {
      req.body = { productId: '123', username: 'testuser', rating: 5, comment: 'Great product!' };
      Review.prototype.save = jest.fn().mockRejectedValue(new Error('Error'));

      await addReviewController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('An error occurred while adding the review');
    });
  });

  describe('getReviewsController', () => {
    it('should retrieve reviews for a product', async () => {
      req.params = { productId: '123' };
      const reviews = [{ rating: 5, comment: 'Great product!' }];
      Review.find = jest.fn().mockResolvedValue(reviews);

      await getReviewsController(req, res, next);

      expect(Review.find).toHaveBeenCalledWith({ productId: '123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(reviews);
    });

    it('should handle errors during retrieving reviews', async () => {
      req.params = { productId: '123' };
      Review.find = jest.fn().mockRejectedValue(new Error('Error'));

      await getReviewsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('An error occurred while retrieving reviews');
    });
  });

  describe('listProductsController', () => {
    it('should list all products', async () => {
      const products = [{ name: 'Product 1' }, { name: 'Product 2' }];
      Product.find = jest.fn().mockResolvedValue(products);

      await listProductsController(req, res, next);

      expect(Product.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should handle errors during retrieving products', async () => {
      Product.find = jest.fn().mockRejectedValue(new Error('Error'));

      await listProductsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('An error occurred while retrieving products');
    });
  });

  describe('searchProductsController', () => {
    it('should retrieve products by productId', async () => {
      req.params = { productId: '123' };
      const products = [{ name: 'Product 1' }];
      Product.find = jest.fn().mockResolvedValue(products);

      await searchProductsController(req, res, next);

      expect(Product.find).toHaveBeenCalledWith({ productId: '123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should return message when no product is found', async () => {
      req.params = { productId: '123' };
      Product.find = jest.fn().mockResolvedValue([]);

      await searchProductsController(req, res, next);

      expect(Product.find).toHaveBeenCalledWith({ productId: '123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('No produts with this Id');
    });

    it('should handle errors during searching products', async () => {
      req.params = { productId: '123' };
      Product.find = jest.fn().mockRejectedValue(new Error('Error'));

      await searchProductsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('An error occurred while retrieving products');
    });
  });

  describe('addReplyController', () => {
    it('should add reply to the review', async () => {
      req.params = { productId: '123' };
      req.body = { username: 'testuser', reply: 'Thank you!' };
      const review = { replies: [], save: jest.fn().mockResolvedValue({}) };
      Review.find = jest.fn().mockResolvedValue([review]);

      await addReplyController(req, res, next);

      expect(Review.find).toHaveBeenCalledWith({ productId: '123', username: 'testuser' });
      expect(review.replies).toContainEqual({ comment: 'Thank you!' });
      expect(review.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Reply added successfully');
    });

    it('should handle no review found', async () => {
      req.params = { productId: '123' };
      req.body = { username: 'testuser', reply: 'Thank you!' };
      Review.find = jest.fn().mockResolvedValue([]);

      await addReplyController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('No review found');
    });

    it('should handle errors during adding reply', async () => {
      req.params = { productId: '123' };
      req.body = { username: 'testuser', reply: 'Thank you!' };
      Review.find = jest.fn().mockRejectedValue(new Error('Error'));

      await addReplyController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error adding reply');
    });
  });

  describe('addProduct', () => {
    it('should add a new product', async () => {
      req.body = { name: 'New Product' };
      Product.prototype.save = jest.fn().mockResolvedValue({});

      await addProduct(req, res, next);

      expect(Product.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Added successfully');
    });

    it('should handle errors during adding a product', async () => {
      req.body = { name: 'New Product' };
      Product.prototype.save = jest.fn().mockRejectedValue(new Error('Error'));

      await addProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error adding product');
    });
  });
});
