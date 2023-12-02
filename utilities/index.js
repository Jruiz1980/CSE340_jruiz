const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const utilities = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
utilities.getNav = async function (req, res, next) {
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
 * Builds the dropdown classification list
 * ************************************ */
utilities.getDropdownList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let dropdown = '<select name="classification_id" id="dropdown">';
  dropdown += "<option>Choose a classification</option>";
  data.rows.forEach((row) => {
    dropdown += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      dropdown += " selected ";
    }
    dropdown += ">" + row.classification_name + "</option>";
  });
  dropdown += "</select>";
  return dropdown;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
utilities.buildClassificationGrid = async function (data) {
  let grid;
  if (data?.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li class="vehicleCard" >';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img class="vehImage1" src="' +
        vehicle.inv_thumbnail +
        '" alt=" ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      //grid += '<hr class="line" />';
      grid += '<h2 class="vehicleInvName">';
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
        "<span class='price'>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"; // how to format price
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

utilities.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications()
  let classification_list = '<select name="classification_id" id="classificationList">'
  classification_list += "<option>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classification_list += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id)
    {
      classification_list += " selected "
    }
    classification_list += ">" + row.classification_name + "</option>"
  })
  classification_list += "</select>"
  return classification_list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
utilities.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
 * Build the vehicle details view HTML
 * ************************************ */
utilities.buildDetailView = async function (data) {
  if (data?.[0]) {
    let vehicle = data[0];
    let grid = `
            <div class="vehicleContainer">
              <img class ="vehiclaDetailImage" src="${
                vehicle.inv_image
              }" alt=" picture of ${vehicle.inv_make}">
              <div class="detailsContent">
                <p class="vdesc vInfo">Description: ${
                  vehicle.inv_description
                }</p>
                <p class="vmake vInfo"><span class='bold-maker'>Make: </span>${
                  vehicle.inv_make
                }</p>
                <p class="vmodel vInfo"><span class='bold-maker'>Model: </span>${
                  vehicle.inv_model
                }</p>
                <p class="vyear vInfo"><span class='bold-maker'>Year: </span>${
                  vehicle.inv_year
                }</p>
                <p class="vprice vInfo"><span class='bold-maker'>Price: </span>${Intl.NumberFormat(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  },
                ).format(vehicle.inv_price)}</p>
                <p class="vmileage vInfo"><span class='bold-maker'>Mileage: </span>${Intl.NumberFormat(
                  "en-US",
                ).format(vehicle.inv_miles)}</p>
                <p class="vcolor vInfo"><span class='bold-maker'>Color: </span>${
                  vehicle.inv_color
                }</p>
              </div>
            </div>
        `;
    return grid;
  } else {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
utilities.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      },
    );
  } else {
    next();
  }
};

/* ******************
 * Check Login View
 ******************** */

utilities.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = utilities;
