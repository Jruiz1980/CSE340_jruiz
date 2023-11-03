const utilities = require("../utilities/");
const baseController = {};

/* *************************
*  Buid Home view with MVC
*  Unit 3, activities
*  ************************* */

baseController.buildHome = async function (req, res, next) {
  try {
  const nav = await utilities.getNav()
  /*req.flash("notice", "This is a flash message.");*/
  res.render("index", { title: "Home", nav })
  } catch (error){
    console.error("An error occured in baseController.buildHome: ", error)
    next(error)
  }
}

module.exports = baseController;
