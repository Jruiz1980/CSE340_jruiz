const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  New class data Validation Rules
 * ********************************* */
validate.addClassRules = () => {
  return [
    //Class name must exist
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification name."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to add the class
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  New car data Validation Rules
 * ********************************* */
validate.addInvRules = () => {
  return [
    // A classification must be selected
    body("classification_id")
      .custom((value) => value !== "Chose a Classification")
      .withMessage("Please select a classification."),

    // Make is required and must be a string
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid make of the car."),

    // Model is required and must be a string
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid model of the car."),

    // Year is required and must be a number
    body("inv_year")
      .trim()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please provide a valid year for the car."),

    // Description is required and must be a string
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description for the car."),

    // Image path is required and must be a string
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid image path for the car."),

    // Thumbnail path is required and must be a string
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid thumbnail path for the car."),

    // Price is required and must be a number
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please provide a valid price for the car."),

    // Mileage is required and must be a number
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please provide the mileage for the car."),

    // Color is required and must be a string
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid color for the car."),
  ];
};

/* ******************************
 * Check data and return errors or continue to add the car
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classification_list = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Classification",
      nav,
      classification_list,
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
    });
    return;
  }
  next();
};

module.exports = validate;
