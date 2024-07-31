const { User, Review, Product } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrationController = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    res.status(201).send('User registered');
  } catch {
    res.status(500).send('Error adding user');
  }
};

const loginController = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const id = user._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
};

const addReviewController = async (req, res) => {
  try {
    const { productId, username, rating, comment } = req.body;
    const newReview = new Review({ productId, username, rating, comment });
    //Add new review to the product
    await newReview.save();
    res.status(201).send('Review added');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while adding the review');
  }
};

const getReviewsController = async (req, res) => {
  try {
    //Get all the reviewes added in the sepecific product
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving reviews');
  }
};

const listProductsController = async (req, res) => {
  try {
    //List all products in the document
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving products')
  }
}

const searchProductsController = async (req, res) => {
  try {
    const { productId } = req.params;
    //Find product by productId
    const products = await Product.find({ productId });
    if(products.length){
      res.status(200).json(products);
    }else{
      res.status(200).send("No produts with this Id");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving products')
  }
}

const addReplyController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { username, reply } = req.body;
    // Find the review by productId and username
    const review = await Review.find({productId, username});
    console.log(review[0].replies,"===============83")
    if (review) {
      // Push the new reply into the replies array
      review[0].replies.push({comment:reply});
      review[0].updatedAt = new Date();      
      // Save the updated review document
      await review[0].save();
      
      res.status(200).send('Reply added successfully');
    } else {
      res.status(500).send('No review found');    
    }
  } catch (error) {
    res.status(500).send('Error adding reply');    
  }
}

const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    // Save the product to the database
    await product.save();
    res.status(200).send('Added successfully');    
  } catch (error) {
    res.status(500).send('Error adding product');    
  }
};

module.exports = {
  registrationController,
  loginController,
  addReviewController,
  getReviewsController,
  listProductsController,
  searchProductsController,
  addReplyController,
  addProduct,
};