// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route for detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailViewById)
);

// Route to build the inventory management view
router.get("/", utilities.handleErrors(invController.renderManagementView));

// Get the view to manage vehicles
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the add new classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.renderAddClassificationView)
);

// Route to build the add new vehicle view
router.get(
  "/add-vehicle",
  utilities.handleErrors(invController.renderAddVehicleView)
);

// New route for rendering the 'add-vehicle' view with the classification dropdown
router.get("/add-vehicle", async (req, res) => {
  const selectedClassificationId = req.query.selectedClassificationId;
  const dropdown = await utilities.getDropdownList(
    req,
    res,
    null,
    selectedClassificationId
  );
  res.render("add-vehicle", { dropdown });
});

// Edit a vehicle
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editVehicleView)
);

// Delete a vehicle view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteVehicleView)
);


// Process the add-classification attempt
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

// Process adding new vehicle
router.post(
  "/add-vehicle",
  invValidate.addVehicleRules(),
  invValidate.checkVehicleData,
  utilities.handleErrors(invController.addVehicle)
);

//Process editing vehicle 
router.post("/update",
invValidate.addVehicleRules(),
invValidate.checkUpdateData,
utilities.handleErrors(invController.updateInventory))

// Delete a vehicle
router.post("/delete", utilities.handleErrors(invController.deleteVehicle))

// Add a catch-all route for 404 errors
router.use(utilities.handleErrors);

(module.exports = router), utilities;
