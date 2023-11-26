/* ***********************
 * Account Routes
 *************************/

// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/accountValidation")

/* ***********************
 * Deliver Login View
 *************************/
// Process the management login
router.get(
  "/",
  /*utilities.checkLogin,*/ utilities.handleErrors(accountController.buildAccountManagement)
)

// Define the GET route for the "/login" path
router.get("/login", utilities.handleErrors(accountController.buildLogin))


// Process the login attempt
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)


//Process the login attempt
router.post(
  "/login", 
regValidate.loginRules(),
regValidate.checkLogData,
utilities.handleErrors(accountController.accountLogin)
)


// Process the register attempt
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


module.exports = router