// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route for detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailViewById)
);

// Route to build the inventory management view
router.get(
  "/manage",
 utilities.handleErrors(invController.renderManagementView)
);

// Route to build the add new classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.renderAddClassificationView)
);

// Process the add-classification attempt
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build the add new vehicle view
router.get(
  "/add-vehicle",
  utilities.handleErrors(invController.renderAddVehicleView)
);


// Process adding new vehicle
router.post(
  "/add-vehicle",
  invValidate.addVehicleRules(),
  invValidate.checkVehicleData,
  utilities.handleErrors(invController.addVehicle)
);

// New route for rendering the 'add-vehicle' view with the classification dropdown
router.get('/add-vehicle', async (req, res) => {
  const selectedClassificationId = req.query.selectedClassificationId;
  const dropdown = await utilities.getDropdownList(
    req,
    res,
    null,
    selectedClassificationId
  );
  res.render('add-vehicle', { dropdown });
});

// Add a catch-all route for 404 errors
router.use(utilities.handleErrors);

(module.exports = router), utilities;