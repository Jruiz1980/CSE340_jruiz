const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
require("dotenv").config();

const accountController = {};

/* *******************
 *  Deliver login view
 * ******************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

/* **********************
 *  Deliver register view
 * ********************* */
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav(); //To activate getNav() I must write utilities
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration.",
    );
    return res.status(500).render(
      "account/register",
      {
        title: "Registration",
        nav,
        errors: null,
      },
      next(),
    );
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`,
    );
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  console.log(accountData);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      console.log("Password is correct");
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
};

accountController.accountLogout = async function (req, res) {
    res.clearCookie("jwt");
    res.redirect("/");
}

accountController.updateAccount = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    console.log("buildAccountManagement");
    res.render("./account/manage", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error(
      "An error ocurred in accountController.buildAccountManagement",
      error,
    );
    next(error);
  }
};

accountController.updateAccountInfo = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;

  const account_id = res.locals.accountData.account_id;
  // console.log(account_firstname, account_lastname, account_email)

  // Get account requesting to be updated
  const accountData = await accountModel.getAccountById(account_id);
  console.log(accountData);

  if (!accountData) {
    return res.status(404).send("Account not found");
  }

  try {
    // Update account info query from model
    await accountModel.updateAccount(accountData);

    // Clear cookie and make new cookie for user
    res.clearCookie("jwt");
    const accessToken = jwt.sign(
      {
        account_id: accountData.account_id,
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email,
        account_type: accountData.account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    );
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

    req.flash(
      "success",
      `Congratulations, ${account_firstname} you've succesfully updated your account information!`
    );
    res.status(201).render("account/manage", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  } catch (err) {
    res.status(500).send("There was an error updating the account");
    console.error(err.message);
  }
}

accountController.updateAccountPassword = async function (req, res) {
  const { account_password } = req.body;
  const account_id = res.locals.accountData.account_id;
  let nav = await utilities.getNav();

  const updateQuery = `
        UPDATE account
        SET account_password = $1
        WHERE account_id = $2
    `;

  try {
    // Set the updated password in accountData before hashing
    res.locals.accountData.account_password = account_password;

    // Hash the updated password
    const hashedPassword = bcrypt.hashSync(account_password, 10);

    // Update the password in the database
    await pool.query(updateQuery, [hashedPassword, account_id]);

    // Log the successful update
    console.log(`Password updated for account ID: ${account_id}`);

    req.flash(
      "success",
      `Congratulations, ${res.locals.accountData.account_firstname}, your account password has been updated successfully!`
    );
    res.status(200).render("account/manage", {
      title: "Edit Account Information",
      nav,
      errors: null,
    });
  } catch (err) {
    console.error("Error updating password:", err);

    // Log the specific error message in the flash message for debugging
    req.flash("error", `Error updating password: ${err.message}`);
    res.status(500).send("An error occurred while updating your password");
  }
}

module.exports = accountController;
