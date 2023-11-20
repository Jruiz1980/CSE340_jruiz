const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

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


/* ***************************
 *  Build Management View
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();

    res.render("./inventory/manage", {
      title: "Inventory Management",
      nav,
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderManagementView:",
      error
    );
    next(error);
  }
};

/* ***************************
 *  Build Add-Classification View
 * ************************** */
invCont.renderAddClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();

    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderAddClassificationView:",
      error
    );
    next(error);
  }
};

/* ***************************
 *  Process New Classification Request
 * ************************** */
invCont.addClassification = async function (req, res) {
  try {
    const { classification_name } = req.body;

    const addClass = await invModel.addClassification(classification_name);

    if (addClass) {
      req.flash("notice", `${classification_name} has been added.`);
      // Clear and rebuild the navigation before rendering the management view
      const nav = await utilities.getNav();
      res.status(201).render("inventory/manage", {
        title: "Inventory Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, adding the classification failed.");
      // Render the add-classification view with an error message
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
      });
    }
  } catch (error) {
    console.log("Error in adding classification:", error);
    res.status(500).send("Internal Server Error");
  }
};


/* ***************************
 *  Build Add-Vehicle View
 * ************************** */
invCont.renderAddVehicleView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationDropdown = await utilities.getDropdownList();
   
    res.render("./inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationDropdown,
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderAddVehicleView:",
      error
    );
    next(error);
  }
};

/* ***************************
 *  Process New Vehicle Request
 * ************************** */
invCont.addVehicle = async function (req, res) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;

    const addNewVehicle = await invModel.addVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );

    if (addNewVehicle) {
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} has been added to inventory.`
      );
      // Clear and rebuild the navigation before rendering the management view
      let nav = await utilities.getNav();
        res.status(201).render("./inventory/manage", {
        title: "Inventory Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.");
      let classificationDropdown = await utilities.getDropdownList();
      // Render the add-vehicle view with an error message
      res.status(501).render("./inventory/add-vehicle", {
        title: "Add New Vehicle",
        nav,
        classificationDropdown,
      });
    }
  } catch (error) {
    console.log("Error in adding vehicle:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = invCont;