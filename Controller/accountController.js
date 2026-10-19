const Account = require('../Model/account');

// Create a new account
const createAccount = async (req, res) => {
  try {

    // Check if all required fields are provided
    if(!req.body.customerId || !req.body.accountNumber || !req.body.accountName || !req.body.accountType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const { customerId, accountNumber, accountName, accountType, balance } = req.body;

    const newAccount = new Account({
      customer: customerId,
      accountNumber,
      accountName,
      accountType,
      balance
    });

    await newAccount.save();
    res.status(201).json({ message: 'Account created successfully', account: newAccount });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account', error: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { customerId, accountNumber, accountName, accountType } = req.body;

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { customer: customerId, accountNumber, accountName, accountType },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({ message: 'Account updated successfully', account: updatedAccount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating account', error: error.message });
  }
};

const getAccountById = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.status(200).json({ message: 'Account found', account });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account', error: error.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json({ message: 'Accounts found', accounts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const deletedAccount = await Account.findByIdAndDelete(accountId);
    if (!deletedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully', account: deletedAccount });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

module.exports = {
  createAccount,
  updateAccount,
  getAccountById,
  getAllAccounts,
  deleteAccount
};