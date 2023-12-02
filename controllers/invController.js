const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

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
    title: className + " Vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build vehicle detail view
 * ************************** 
let isDetailViewProcessed = false; */ // flag because detail build is called twice

invCont.buildDetailViewById = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryItemById(inv_id);
  const grid = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const className = data[0].inv_model;
  res.render("./inventory/vehicle", {
    title: className + " Vehicle",
    nav,
    grid,
  });
};

/* ***************************
 *  Build Management View
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/manage", {
      title: "Inventory Management",
      nav,
      classificationSelect
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderManagementView:",
      error,
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
      error,
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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationDropdown,
      classificationSelect      
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderAddVehicleView:",
      error,
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
      inv_color,
    );

    if (addNewVehicle) {
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} has been added to inventory.`,
      );
      // Clear and rebuild the navigation before rendering the management view
      let nav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList()
      res.status(201).render("./inventory/manage", {
        title: "Inventory Management",
        nav,
        classificationSelect        
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


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-vehicle", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


module.exports = invCont;
