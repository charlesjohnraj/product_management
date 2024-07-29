const express = require('express');
const apiGatewayRoutes = require('./routes/apiGatewayRoutes');
require('dotenv').config();

const app = express();
const port = 9000

app.use('/', apiGatewayRoutes);

app.listen(port, () => {
    console.log(`Gateway running on port ${port}`)
});
