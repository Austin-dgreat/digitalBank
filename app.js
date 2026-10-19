const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/databaseconfig');

const app = express();

const accountRoute = require('./Routes/accountRoute');

const customerRoute = require('./Routes/customerroute');

dotenv.config();  // Load environment variables from .env file
connectDB();  // Connect to the MongoDB database

app.use(express.json());  // Middleware to parse JSON request bodies

app.use('/customers', customerRoute);  // use the customer routes for any requests to /customers

app.use('/accounts', accountRoute);  // use the account routes for any requests to /accounts


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});