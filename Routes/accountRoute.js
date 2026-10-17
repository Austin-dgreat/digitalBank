const express = require('express');
const router = express.Router();

const accountController = require('../Controller/accountController');

// define the routes
router.post('/createaccount', accountController.createAccount);

router.put('/updateaccount/:accountId', accountController.updateAccount);

router.get('/getAccountById/:accountId', accountController.getAccountById);
router.get('/getAllAccounts', accountController.getAllAccounts);

router.delete('/deleteaccount/:accountId', accountController.deleteAccount);

// export the router
module.exports = router;