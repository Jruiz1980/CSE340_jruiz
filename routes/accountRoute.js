/* ***********************
 * Account Routes
 *************************/

// Needed Resources
const utilities = require("../utilities/index")
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/accountValidation")

/* ***********************
 * Deliver Login View
 *************************/

// Define the GET route for the "/login" path
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the management login
router.get(
  "/",
  utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement)
);



//Process the login attempt
router.post(
  "/login", 
regValidate.loginRules(),
regValidate.checkLogData,
utilities.handleErrors(accountController.accountLogin)
);

// Process the login attempt
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Process the register attempt
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


module.exports = router;