# Admin Setup Guide

## Default Admin Credentials

The app uses the same default admin credentials as the reference app:

- **Email**: `admin@admin.com`
- **Password**: `admin`
- **Name**: `Usman Akram`

## Setting Up Admin User

### Option 1: Using the Script (Recommended)

Run the create-admin script to automatically create the admin user:

```bash
node create-admin.js
```

This will:
- Connect to MongoDB
- Check if admin already exists
- Create admin user with proper role if it doesn't exist
- Update admin role if user exists but doesn't have admin role

### Option 2: Manual Registration

1. Go to `/register`
2. Use the pre-filled form (email: admin@admin.com, password: admin)
3. After registration, update the user in MongoDB to add admin role:
   ```javascript
   db.users.updateOne(
     { email: "admin@admin.com" },
     { $set: { roles: ["admin"] } }
   )
   ```

## Admin Panel Access

1. **Login**: Go to `/login` and use the default credentials
2. **Auto-redirect**: After login, admins are automatically redirected to `/super-admin`
3. **Admin Dashboard**: Access at `/super-admin`
4. **Product Management**: Access at `/super-admin/products`

## Admin Panel Features

### Product Management (Full CRUD)

- **Create Product**: `/super-admin/products/create`
  - Form fields: Name, Price, Color, Department, Description, Image
  - Image uploads are saved to `public/images/uploaded/`
  
- **List Products**: `/super-admin/products`
  - Shows all products in a table
  - Displays: Image, Name, Department, Color, Price, Description
  - Actions: Edit, Delete buttons for each product
  
- **Edit Product**: `/super-admin/products/edit/:id`
  - Pre-filled form with existing product data
  - Can update all fields including image
  - Current image is displayed
  
- **Delete Product**: `/super-admin/products/delete/:id`
  - Confirmation dialog before deletion
  - Redirects back to product list after deletion

## Security

- Admin routes are protected by `super-admin` middleware
- Only users with `roles: ["admin"]` can access admin panel
- Non-admin users are redirected to home page if they try to access admin routes
- Session-based authentication for web routes

## Testing Admin Panel

1. **Create Admin**: Run `node create-admin.js`
2. **Start Server**: `npm run dev` or `npm start`
3. **Login**: Go to `http://localhost:3000/login`
4. **Use Credentials**: 
   - Email: `admin@admin.com`
   - Password: `admin`
5. **Access Admin Panel**: You'll be redirected to `/super-admin`
6. **Test CRUD**:
   - Create a product
   - Edit the product
   - Delete the product

## Coherency with Reference App

✅ Same default admin credentials
✅ Same login/register form style
✅ Same admin panel structure
✅ Same product CRUD routes
✅ Same middleware protection
✅ Same MongoDB models
✅ Same session management


