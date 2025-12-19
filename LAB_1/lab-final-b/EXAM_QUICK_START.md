# Lab Exam - Quick Start Guide

## Pre-Exam Setup

1. **Ensure MongoDB is running**
   ```bash
   # Check if MongoDB is running
   mongod
   ```

2. **Verify database connection**
   - Check `config/development.json`:
   ```json
   {
     "db": "mongodb://localhost:27017/adagency"
   }
   ```

3. **Create admin user (if not done)**
   ```bash
   node create-admin.js
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

---

## Testing All 4 Tasks (5 Minutes)

### Task 1: Order Preview & Finalize
1. Go to: `http://localhost:3000/products`
2. Click "Add to Cart" on any product
3. Go to: `http://localhost:3000/cart`
4. Click "Proceed to Order Preview"
5. Verify cart items, prices, quantities, grand total displayed
6. Enter email and click "Confirm Order"
7. Verify success page shows order summary
8. Check MongoDB: `db.orders.find()` - should see new order

### Task 2: Coupon/Discount
1. Go to: `http://localhost:3000/order/preview?coupon=SAVE10`
2. Verify discount is shown (10% off)
3. Verify Original Subtotal, Discount Amount, Final Total displayed
4. Confirm order and check `discountAmount` in saved order

### Task 3: Order History
1. Go to: `http://localhost:3000/my-orders`
2. Enter email used in previous order
3. Verify all orders displayed with Order ID, Date, Total, Status

### Task 4: Status Lifecycle
1. Login as admin: `http://localhost:3000/login`
   - Email: `admin@admin.com`
   - Password: `admin`
2. Go to: `http://localhost:3000/super-admin/orders`
3. Click "Mark as Processing" on a "Placed" order
4. Verify status changes to "Processing"
5. Click "Mark as Delivered"
6. Verify status changes to "Delivered"
7. Try clicking "Mark as Processing" again (should show error)

---

## Git Commands (Before Exam Ends)

```bash
# Check status
git status

# Add all files
git add .

# Commit with descriptive message
git commit -m "Lab Final: Complete Order Management System

Task 1: Order Preview & Finalization
- Route /order/preview displays cart items
- POST /order/confirm saves order with status Placed
- Clears cart session after order

Task 2: Coupon/Discount Middleware
- applyDiscount middleware applies 10% discount for SAVE10
- Shows discount on preview page

Task 3: Customer Order History
- Route /my-orders allows email lookup
- Displays Order ID, Date, Total, Status

Task 4: Order Status Lifecycle
- Status enum: Placed, Processing, Delivered
- Admin can update status step-by-step
- Validation prevents skipping states"

# Push to repository
git push
```

---

## Common Issues & Solutions

### Issue: MongoDB connection error
**Solution**: Make sure MongoDB is running on `mongodb://localhost:27017`

### Issue: Admin routes not accessible
**Solution**: Ensure admin user has `roles: ["admin"]` in database

### Issue: Cart is empty
**Solution**: Add products first via `/products` page, then add to cart

### Issue: Discount not applying
**Solution**: Use exact coupon code `SAVE10` (case-insensitive but must match)

---

## Key Routes Summary

| Route | Method | Purpose |
|-------|--------|---------|
| `/order/preview` | GET | Show order preview with cart items |
| `/order/confirm` | POST | Finalize order, save to DB |
| `/order/success/:id` | GET | Show order success page |
| `/my-orders` | GET/POST | Customer order history |
| `/super-admin/orders` | GET | Admin: List all orders |
| `/super-admin/orders/:id/status` | POST | Admin: Update order status |

---

## Exam Checklist

- [ ] All 4 tasks implemented
- [ ] All routes working
- [ ] MongoDB connection working
- [ ] Admin user created
- [ ] All features tested
- [ ] Code committed to Git
- [ ] Code pushed to repository
- [ ] Ready for viva

---

**Good Luck! 🚀**

