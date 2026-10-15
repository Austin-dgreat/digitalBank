const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['current', 'savings']
  },

});
module.exports = mongoose.model('Account', accountSchema);