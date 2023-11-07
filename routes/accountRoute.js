/* ***********************
 * Account Routes
 *************************/

// Needed Resources
const utilities = require("../utilities/index")
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
//const logValidate = require("../utilities/accountValidation");

/* ***********************
 * Deliver Login View
 *************************/

// Define the GET route for the "/login" path
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

module.exports = router;