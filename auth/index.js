const express = require('express');
const dbConnect = require('./config/mongoDbConfig');
const authRoutes = require('./routes/authRoute');
require('dotenv').config();

dbConnect();

const app = express();
const port = 8000;
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Auth service running on port ${port}`)
});
