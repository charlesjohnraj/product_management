const Review = require('../models/review');

const addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    const newReview = new Review({ productId, userId, rating, comment });
    await newReview.save();
    res.status(201).send('Review added');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while adding the review');
  }
};

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving reviews');
  }
};

module.exports = { addReview, getReviews };
