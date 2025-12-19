var express = require("express");
var router = express.Router();
var User = require("../models/User");
const bcrypt = require("bcryptjs");

/* GET home page */
router.get("/", function (req, res, next) {
  return res.render("site/homepage", { layout: "layout" });
});

/* GET checkout page */
router.get("/checkout", function (req, res, next) {
  return res.render("site/checkout", { layout: "layout" });
});

/* GET REST API demo page */
router.get("/restapi", function (req, res, next) {
  return res.render("site/restapi", { layout: "layout" });
});

/* GET login page */
router.get("/login", function (req, res, next) {
  return res.render("site/login", { layout: "layout" });
});

/* POST login */
router.post("/login", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("danger", "User with this email not present");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.flash("success", "Logged in Successfully");
    // Redirect admin to admin panel, customer to home
    if (user.roles && user.roles.includes("admin")) {
      return res.redirect("/super-admin");
    }
    return res.redirect("/");
  } else {
    req.flash("danger", "Invalid Password");
    return res.redirect("/login");
  }
});

/* GET register page */
router.get("/register", function (req, res, next) {
  return res.render("site/register", { layout: "layout" });
});

/* POST register */
router.post("/register", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "User with given email already registered");
    return res.redirect("/register");
  }
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  // Default role is customer (no admin role)
  if (!user.roles) {
    user.roles = [];
  }

  await user.save();
  req.flash("success", "Registration successful. Please login.");
  return res.redirect("/login");
});

/* GET logout */
router.get("/logout", async (req, res) => {
  req.session.user = null;
  req.flash("success", "Logged out successfully");
  return res.redirect("/login");
});

/* GET contact page */
router.get("/contact-us", function (req, res, next) {
  return res.render("site/contact", { layout: "layout" });
});

module.exports = router;



