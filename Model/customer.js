const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  kyc: {
      type: String,
      enum: ["BVN", "NIN"],
    },

  number: {
    type: String,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  verifiedAt: {
    type: Date,
  },
},
{
  timestamps: true
}
);

// create a model for the customer schema
module.exports = mongoose.model('Customer', customerSchema);