// Middleware to check if user is admin and set admin layout
module.exports = async function (req, res, next) {
  // Check if user is logged in
  if (!req.session.user) {
    req.flash("danger", "You need to login to access admin panel");
    return res.redirect("/login");
  }
  
  // Check if user has admin role
  if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
    req.flash("danger", "You need admin privileges to access this page");
    return res.redirect("/");
  }
  
  res.locals.layout = "super-admin-layout";
  res.locals.title = "Ad-Agency Admin Panel";
  next();
};


