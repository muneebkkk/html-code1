function calculatePricing(cartItems, couponCode) {
  const subtotal = (cartItems || []).reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  let discountAmount = 0;
  const normalized = (couponCode || "").trim().toUpperCase();

  if (normalized === "SAVE10") {
    discountAmount = Number((subtotal * 0.1).toFixed(2));
  }

  const finalTotal = Number((subtotal - discountAmount).toFixed(2));

  return {
    subtotal,
    discountAmount,
    finalTotal,
    couponCode: normalized || null,
  };
}

async function applyDiscount(req, res, next) {
  try {
    const cart = req.session.cart || [];

    // coupon can come from query (GET) or body (POST)
    const coupon =
      (req.method === "GET" ? req.query.coupon : req.body.coupon) || "";

    const pricing = calculatePricing(cart, coupon);

    // Attach to request so routes can use it
    req.orderPricing = pricing;

    next();
  } catch (err) {
    console.error("Error in applyDiscount middleware:", err);
    return next(err);
  }
}

module.exports = {
  applyDiscount,
  calculatePricing,
};


