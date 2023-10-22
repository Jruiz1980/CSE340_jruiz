const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ****************************************
 *  Build inventory by classification view
 ****************************************** */
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
 *  Build vehicle detail view
 * ************************** */
let isDetailViewProcessed = false; // flag because detail build is called twice

invCont.buildById = async function (req, res, next) {
  if (isDetailViewProcessed) {
    return;
  }
  // get inventory id from params
  const inventory_id = req.params.inventoryId;
  console.log(`\nINVENTORY ID: ${inventory_id}`);

  // get specific vehicle data
  const vehicleDetails = await invModel.getInventoryItemById(inventory_id);

  console.log(`VEHICLE DETAILS: ${vehicleDetails}`);

  // in case vehicle isn't found
  if (!vehicleDetails) {
    return res.status(404).send("Vehicle not found");
  }

  const detailView = await utilities.buildDetailView(vehicleDetails);
  const nav = await utilities.getNav();

  // render detail view
  res.render("./inventory/detail", {
    title: vehicleDetails.make + " " + vehicleDetails.model,
    nav,
    detailView,
  });
};

module.exports = invCont;