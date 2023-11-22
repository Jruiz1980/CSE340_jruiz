const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build a view of a car with the inventory id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const vehicleData = await invModel.getCarByInvId(inv_id);
  const carView = await utilities.buildCarView(vehicleData);
  let nav = await utilities.getNav();
  const carName = vehicleData[0].inv_model;
  res.render("./inventory/car-details", {
    title: carName + " Details Page",
    nav,
    carView,
  });
};

/* ***************************
 *  Build the management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  const manageView = await utilities.buildManagementView();
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    manageView,
  });
};

/* ***************************
 *  Build the view to add a new classification
 * ************************** */
invCont.buildAddClass = async function (req, res, next) {
  // const addClassView = await utilities.()
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    errors: null,
    title: "Add Classification",
    nav,
    // addClassViewView
  });
};

/* ***************************
 *  Build the view to add a new car
 * ************************** */
invCont.buildAddInv = async function (req, res, next) {
  // const addClassView = await utilities.()
  let nav = await utilities.getNav();
  const classification_list = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    errors: null,
    title: "Add Inventory",
    nav,
    classification_list,
    // addClassViewView
  });
};

/* ****************************************
 *  Process adding a new classification
 * *************************************** */
invCont.addClass = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const addClassification = await invModel.addClass(classification_name);

  if (addClassification) {
    nav = await utilities.getNav();
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${classification_name}.`
    );
    const manageView = await utilities.buildManagementView();
    res.status(201).render("inventory/management", {
      title: "Management ",
      nav,
      manageView,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding the car failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Process adding a new car
 * *************************************** */
invCont.addInv = async function (req, res) {
  let nav = await utilities.getNav();
  const manageView = await utilities.buildManagementView();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const addInv = await invModel.addInv(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (addInv) {
    req.flash("notice", `Congratulations, you\'ve added ${inv_model}.`);
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      manageView,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    });
  }
};

invCont.triggerError = function (req, res, next) {
  throw new error();
};

module.exports = invCont;
