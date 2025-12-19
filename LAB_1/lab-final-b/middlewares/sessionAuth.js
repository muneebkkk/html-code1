//sets user variable for ejs files
async function sessionAuth(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.isAdmin = false;
  if (req.session.user) {
    res.locals.isAdmin = Boolean(
      req.session.user.roles && req.session.user.roles.find((r) => r == "admin")
    );
  } else req.session.user = null;
  
  // Set cart information for all views
  res.locals.cart = req.session.cart || [];
  res.locals.cartCount = (req.session.cart || []).length;
  res.locals.cartTotal = (req.session.cart || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  
  //set flash function to req;
  //use req.flash("info","message") in router to set a flash message
  req.flash = function (type, message) {
    req.session.flash = { type, message };
  };
  //if flash message is set. set it to res.locals and clear it.
  if (req.session.flash) {
    res.locals.flash = req.session.flash;
    req.session.flash = null;
  }
  next();
}

module.exports = sessionAuth;


