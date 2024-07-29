const express = require('express');
const searchRoutes = require('./routes/searchRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/search', searchRoutes);

app.listen(6000, () => console.log('Search service running on port 6000'));
