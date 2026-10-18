const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bvnSchema = new mongoose.Schema({
    customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  bvn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  dob: {
    type: Date,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  },

  verified: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Bvn", bvnSchema);
