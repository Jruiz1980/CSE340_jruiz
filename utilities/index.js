const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the car detail view HTML
 * ************************************ */
Util.buildCarView = async function (data) {
  // console.log("DATA:");
  // console.log(data);
  let carView;
  carView = "<div id=car-details>";
  carView +=
    '<img id="car-img" src="' +
    data[0].inv_image +
    '" alt="Car Detail Photo"/>';
  carView += '<div id="car-info">';
  carView += '<h2 id="car-heading">';
  carView +=
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  carView += "</h2>";
  carView += '<ul id="info-list">';
  carView +=
    "<li><b>Price: </b>" +
    "$" +
    new Intl.NumberFormat("en-US").format(data[0].inv_price) +
    "</li>";
  carView += "<li><b>Description: </b>" + data[0].inv_description + "</li>";
  carView +=
    "<li><b>Miles: </b>" +
    new Intl.NumberFormat("en-US").format(data[0].inv_miles) +
    "</li>";
  carView += "<li><b>Color: </b>" + data[0].inv_color + "</li>";
  carView += "</ul>";
  carView += "</div>";
  carView += "</div>";
  return carView;
};

/* **************************************
 * Build the management view HTML
 * ************************************ */
Util.buildManagementView = async function () {
  let manageView;
  manageView = `
  <div id="manageDiv">
    <a href="/inv/addclass" class="manageLinks">Add Classification</a>
    <a href="/inv/addinv" class="manageLinks">Add Inventory</a>
  </div>`;
  return manageView;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classification_list =
    '<select name="classification_id" id="classification_id">';
  classification_list += "<option>Chose a Classification</option>";
  data.rows.forEach((row) => {
    classification_list += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classification_list += " selected ";
    }
    classification_list += ">" + row.classification_name + "</option>";
  });
  classification_list += "</select>";
  return classification_list;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

module.exports = Util;
