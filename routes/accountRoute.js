/* ***********************
 * Account Routes
 *************************/

// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
//const logValidate = require("../utilities/accountValidation");

/* ***********************
 * Deliver Login View
 *************************/

// Define the GET route for the "/login" path
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
/*router.post(
  "/login",
  logValidate.loginRules(),
  logValidate.checkLogData,
  Util.handleErrors(accountController.loginAccount)
);*/

module.exports = router;