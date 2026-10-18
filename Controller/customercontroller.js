const axios = require('axios');
const customer = require('../Model/customer');
const bvn = require('../Model/bvn');

const NIBSS_API_URL = 'https://nibssbyphoenix.onrender.com';

// customer onboarding
const onboardCustomer = async (req, res) => {
  try {
    const { firstName, lastName, middleName, dateOfBirth, gender, phoneNumber, email, password, kyc, number } = req.body;


    // Check if the customer already exists
    const existingCustomer = await customer.findOne ({
      $or: [
        { email },
        { phoneNumber },
      ],
    });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }
  
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  // create customer
  const customer = new customer({
    firstName,
    lastName,
    middleName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    password,
    kyc,
    number
  });

  await customer.save();
  res.status(201).json({ message: 'Customer onboarded successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error onboarding customer', error: error.message });
  }
};

// login customer
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the customer by email
    const customer = await customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If credentials are valid, return a success response
    res.status(200).json({ message: 'Login successful', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in customer', error: error.message });
  }
};