const axios = require('axios');
const customer = require('../Model/customer');
const bvn = require('../Model/bvn');
const bcrypt = require('bcryptjs');

const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL || 'https://nibssbyphoenix.onrender.com';

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
      password: hashedPassword,
      kyc,
      number
    });

    await customer.save();

    // generate nibss token
    const generateNibssToken = await axios.post(`${NIBSS_BASE_URL}/api/auth/token`, {
      api_key: process.env.NIBSS_API_KEY,
      api_secret: process.env.NIBSS_API_SECRET,
    });

    const token = generateNibssToken.data.token;

    // insert bvn into nibss
    const bvnVerification = await axios.post(`${NIBSS_BASE_URL}/api/insertBvn`, {
      bvn,
      firstName,
      lastName,
      dob: dateOfBirth,
      phone: phoneNumber,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );

    // save bvn to database
    const bvnRecord = await bvn.create({
      customer: customer._id,
      bvn,
      firstName,
      lastName,
      dob: dateOfBirth,
      phone: phoneNumber,
      verified: true,
    });

    // create account using bvn
    const accountCreation = await axios.post(`${NIBSS_BASE_URL}/api/createAccount`, {
      kycType: "BVN",
      kycID: bvn,
      dob: dateOfBirth,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // get account number from nibss
    const accountData = accountCreation.data;

    const accountNumber = accountData.accountNumber || accountData.data?.accountNumber;

    if (!accountNumber) {
      return res.status(500).json({ message: 'Account number not found in NIBSS response' });
    }

    // save account in database
    const account = await account.create({
      customer: customer._id,
      accountNumber,
      accountName: `${firstName} ${lastName}`,
      accountType: "savings",
      balance: 0,
      currency: "NGN",
      kycType: "BVN",
      kycID: bvn,
      status: "active",
    });

    // return success response
    res.status(201).json({
      success: true,
      message: 'Customer onboarded successfully',

      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
      },
      bvn: {
        id: bvnRecord._id,
        bvn: bvnRecord.bvn,
        verified: bvnRecord.verified,
      },
      account: {
        id: account._id,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        accountType: account.accountType,
        balance: account.balance,
        currency: account.currency,
      },
    });
  } catch (error) {
    console.error('Error onboarding customer:', error.message);

    res.status(500).json({ message: 'Error onboarding customer', error: error.message });
  }
};

// login customer
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the customer by email
    const customerRecord = await customer.findOne({ email });
    if (!customerRecord) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, customerRecord.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If credentials are valid, return a success response
    res.status(200).json({ message: 'Login successful', customer: customerRecord });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in customer', error: error.message });
  }
};

module.exports = {
  onboardCustomer,
  loginCustomer,
};