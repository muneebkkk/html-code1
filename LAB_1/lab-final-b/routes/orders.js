var express = require("express");
var router = express.Router();
var Order = require("../models/Order");
var Product = require("../models/Product");
var { applyDiscount } = require("../middlewares/applyDiscount");

// Helper: ensure cart exists
function getCart(req) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  return req.session.cart;
}

// Example helper to add item to cart (for testing/demo)
// You can call this via GET /cart/add/:id
router.get("/cart/add/:id", async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("danger", "Product not found");
      return res.redirect("/products");
    }
    const cart = getCart(req);
    const existing = cart.find(
      (item) => String(item.productId) === String(product._id)
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: Number(product.price) || 0,
        quantity: 1,
        image: product.image || null,
      });
    }
    req.session.cart = cart;
    req.flash("success", "Product added to cart");
    return res.redirect("/products");
  } catch (err) {
    next(err);
  }
});

// Simple cart view (optional)
router.get("/cart", function (req, res, next) {
  const cart = getCart(req);
  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  return res.render("site/cart", {
    layout: "layout",
    cart,
    subtotal,
  });
});

// Update cart item quantity
router.post("/cart/update/:productId", function (req, res, next) {
  try {
    const cart = getCart(req);
    const productId = req.params.productId;
    const action = req.body.action; // 'increase', 'decrease', or 'remove'
    
    const itemIndex = cart.findIndex(
      (item) => String(item.productId) === String(productId)
    );
    
    if (itemIndex === -1) {
      req.flash("danger", "Item not found in cart");
      return res.redirect("/order/preview");
    }
    
    if (action === "remove") {
      cart.splice(itemIndex, 1);
      req.flash("success", "Item removed from cart");
    } else if (action === "decrease") {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
        req.flash("success", "Quantity updated");
      } else {
        cart.splice(itemIndex, 1);
        req.flash("success", "Item removed from cart");
      }
    } else if (action === "increase") {
      cart[itemIndex].quantity += 1;
      req.flash("success", "Quantity updated");
    }
    
    req.session.cart = cart;
    
    // If cart is empty after update, redirect to products
    if (cart.length === 0) {
      req.flash("info", "Your cart is now empty");
      return res.redirect("/products");
    }
    
    // Redirect back to order preview with coupon and email if they exist
    const coupon = req.body.coupon || req.query.coupon || "";
    const email = req.body.email || req.query.email || "";
    let redirectUrl = "/order/preview";
    const params = [];
    if (coupon) params.push("coupon=" + encodeURIComponent(coupon));
    if (email) params.push("email=" + encodeURIComponent(email));
    if (params.length > 0) {
      redirectUrl += "?" + params.join("&");
    }
    return res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
});

// Task 1: Order Preview
router.get("/order/preview", applyDiscount, function (req, res, next) {
  const cart = getCart(req);
  if (!cart.length) {
    req.flash("info", "Your cart is empty. Please add some products first.");
    return res.redirect("/products");
  }

  const pricing = req.orderPricing;

  const user = req.session.user || null;
  
  // Preserve email from query parameter if it was submitted
  const emailValue = req.query.email || (user && user.email ? user.email : '');

  return res.render("site/order-preview", {
    layout: "layout",
    cart,
    pricing,
    user,
    emailValue,
  });
});

// Task 1: Order Finalization
router.post("/order/confirm", applyDiscount, async function (req, res, next) {
  try {
    const cart = getCart(req);
    if (!cart.length) {
      req.flash("info", "Your cart is empty. Please add some products first.");
      return res.redirect("/products");
    }

    const pricing = req.orderPricing;

    const email =
      (req.body.email && req.body.email.trim()) ||
      (req.session.user && req.session.user.email);

    if (!email) {
      req.flash("danger", "Email is required to place an order.");
      return res.redirect("/order/preview");
    }

    const orderItems = cart.map((item) => ({
      product: item.productId || null,
      name: item.name,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    const order = new Order({
      email,
      items: orderItems,
      subtotal: pricing.subtotal,
      discountAmount: pricing.discountAmount,
      totalAmount: pricing.finalTotal,
      status: "Placed",
    });

    await order.save();

    // clear cart
    req.session.cart = [];

    return res.redirect("/order/success/" + order._id);
  } catch (err) {
    next(err);
  }
});

// Success page
router.get("/order/success/:id", async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      req.flash("danger", "Order not found");
      return res.redirect("/");
    }
    return res.render("site/order-success", {
      layout: "layout",
      order,
    });
  } catch (err) {
    next(err);
  }
});

// Task 3: Customer Order History
router.get("/my-orders", function (req, res, next) {
  // Show empty page with just the form initially
  return res.render("site/order-history", {
    layout: "layout",
    orders: [],
    email: (req.session.user && req.session.user.email) || "",
  });
});

router.post("/my-orders", async function (req, res, next) {
  try {
    const email =
      (req.body.email && req.body.email.trim()) ||
      (req.session.user && req.session.user.email);

    if (!email) {
      req.flash("danger", "Please enter an email address.");
      return res.redirect("/my-orders");
    }

    const orders = await Order.find({ email }).sort({ createdAt: -1 });

    return res.render("site/order-history", {
      layout: "layout",
      orders,
      email,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


