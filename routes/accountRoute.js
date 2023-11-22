const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountsController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Get requests
router.get(
  "/",
  utilities.handleErrors(accountsController.buildAccountManagement)
);
router.get("/login", utilities.handleErrors(accountsController.buildLogin));
router.get(
  "/register",
  utilities.handleErrors(accountsController.buildRegister)
);

// ADD NEW ACCOUNT
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountsController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountsController.accountLogin)
);

module.exports = router;
