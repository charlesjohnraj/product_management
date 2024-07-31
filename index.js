const express = require('express');
const dbConnect = require('./config/mongoDbConfig');
const routes = require('./routes/routes');
require('dotenv').config();

dbConnect();//Connect Mongo DB

const app = express();
const port = 9090;
app.use(express.json());

app.use('/',routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});