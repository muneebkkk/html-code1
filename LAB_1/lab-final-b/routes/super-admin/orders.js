const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");

// Helper to compute next valid status
function getNextStatus(current) {
  if (current === "Placed") return "Processing";
  if (current === "Processing") return "Delivered";
  return null;
}

// List all orders
router.get("/orders", async function (req, res, next) {
  try {
    // Fetch all orders from all customers, sorted by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    
    // Calculate statistics
    const totalOrders = orders.length;
    const placedCount = orders.filter(o => o.status === 'Placed').length;
    const processingCount = orders.filter(o => o.status === 'Processing').length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
    
    return res.render("super-admin/orders/list", {
      orders,
      totalOrders,
      placedCount,
      processingCount,
      deliveredCount,
    });
  } catch (err) {
    next(err);
  }
});

// Update order status with validation
router.post("/orders/:id/status", async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      req.flash("danger", "Order not found");
      return res.redirect("/super-admin/orders");
    }

    const targetStatus = req.body.status;
    const allowedStatuses = ["Placed", "Processing", "Delivered"];

    if (!allowedStatuses.includes(targetStatus)) {
      req.flash("danger", "Invalid status value");
      return res.redirect("/super-admin/orders");
    }

    const currentStatus = order.status;
    const nextStatus = getNextStatus(currentStatus);

    // Rule: can only go Placed -> Processing -> Delivered
    if (targetStatus === currentStatus) {
      // no change, just redirect
      return res.redirect("/super-admin/orders");
    }

    if (!nextStatus || targetStatus !== nextStatus) {
      req.flash(
        "danger",
        `Invalid status transition from ${currentStatus} to ${targetStatus}.`
      );
      return res.redirect("/super-admin/orders");
    }

    order.status = targetStatus;
    await order.save();
    req.flash("success", "Order status updated successfully");
    return res.redirect("/super-admin/orders");
  } catch (err) {
    next(err);
  }
});

module.exports = router;


