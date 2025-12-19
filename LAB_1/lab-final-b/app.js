var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var session = require("express-session");
var mongoose = require("mongoose");
var config = require("config");
var bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var ordersRouter = require("./routes/orders");
var protectedRouter = require("./routes/protected");
var sessionAuth = require("./middlewares/sessionAuth");
var superAdminMiddleware = require("./middlewares/super-admin");
var checkSessionAuth = require("./middlewares/checkSessionAuth");
var apiauth = require("./middlewares/apiauth");

var app = express();

// MongoDB connection
mongoose
  .connect(config.get("db"))
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: config.get("sessionSecret"),
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true,
  })
);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session auth middleware (must be before routes)
app.use(sessionAuth);

// API Routes
app.use("/api/public/products", require("./routes/api/public/products"));
app.use("/api/categories", require("./routes/api/catagories"));
app.use("/api/products", apiauth, require("./routes/api/products"));
app.use("/api/auth", require("./routes/api/auth"));

// Super Admin Routes (protected)
app.use(
  "/super-admin",
  superAdminMiddleware,
  require("./routes/super-admin/dashbosrd")
);
app.use(
  "/super-admin",
  superAdminMiddleware,
  require("./routes/super-admin/products")
);
app.use(
  "/super-admin",
  superAdminMiddleware,
  require("./routes/super-admin/orders")
);

// Main Routes
app.use("/", indexRouter);
app.use("/", ordersRouter);
app.use("/my-account", checkSessionAuth, protectedRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;



