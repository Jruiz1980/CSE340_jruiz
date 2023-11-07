const utilities = require("../utilities");
const accountModel = require("../models/account-model");

const accountController = {};
/* *******************
 *  Deliver login view
 * ******************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
};

/* **********************
 *  Deliver register view
 * ********************* */
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();//To activate getNav() I must write utilities
  res.render("account/register", {
    title: "Register",
    nav,
  });
};

module.exports = accountController;
