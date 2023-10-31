const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ****************************************
 *  Build inventory by classification view
 ****************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build vehicle detail view
 * ************************** 
let isDetailViewProcessed = false; */ // flag because detail build is called twice

invCont.buildDetailViewById = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryItemById(inv_id)
  const grid = await utilities.buildDetailView(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_model
  res.render("./inventory/vehicle", {
    title: className + " Vehicle",
    nav,
    grid,
  })
}

module.exports = invCont