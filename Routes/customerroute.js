const express = require('express');
const router = express.Router();

const customerController = require('../Controller/customercontroller');

// define the routes
router.post('/onboardcustomer', customerController.onboardCustomer);
router.post('/logincustomer', customerController.loginCustomer);


module.exports = router;
