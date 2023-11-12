/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require("./database/")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/index")
const bodyParser = require("body-parser")


/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/

app.use(static)

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account Routes
app.use("/account", require("./routes/accountRoute"))


/********************* 
 * Middleware
 **********************/
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  const errorMessage = {
    status: 404,
    message: 'Sorry, we appear to have lost that page.',
    image: '<img src="/images/site/error.png" alt="Error image">',
  };
  next(errorMessage);
});

/* ********************************
*  Express Error Handler
*  Place after all other middleware
*********************************** */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404) {
    message = err.message,
    image = '<img src="/images/site/error.png" alt="Error image">'
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?',
    image = '<img src="/images/site/serverError.jpg" alt="Server Error image">'
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    image,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
