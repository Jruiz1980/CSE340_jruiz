// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidation = require("../utilities/inv-validation");

/*************************************
GET ROUTES 
*************************************/
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
// Route to build a car view with the Id
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInvId)
);
//Route to trigger the 500 error
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);
// Inventory Management view
router.get("/", utilities.handleErrors(invController.buildManagementView));
// Add  class view
router.get("/addclass", utilities.handleErrors(invController.buildAddClass));
// Add Inventory view
router.get("/addinv", utilities.handleErrors(invController.buildAddInv));

/*************************************
POST ROUTES 
*************************************/
// Add a new classification
router.post(
  "/addclass",
  invValidation.addClassRules(),
  invValidation.checkClassData,
  utilities.handleErrors(invController.addClass)
);
// Add a new car
router.post(
  "/addinv",
  invValidation.addInvRules(),
  invValidation.checkInvData,
  utilities.handleErrors(invController.addInv)
);

module.exports = router;
