const express = require('express');
const connectDB = require('./config/mongoDbConfig');
const reviewRoutes = require('./routes/reviewRoutes');
require('dotenv').config();

connectDB();
const app = express();
const port = 7000;
app.use(express.json());

app.use('/reviews', reviewRoutes);

app.listen(port, () => {
    console.log(`Review-ser running on port ${port}`)
});
