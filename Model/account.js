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
  accountName: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['current', 'savings']
  },
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0
  }

},
{
  timestamps: true
}
);
const account = mongoose.model('account', accountSchema);
module.exports = account;