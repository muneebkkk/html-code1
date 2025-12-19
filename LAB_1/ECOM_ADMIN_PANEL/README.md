# Ad-Agency App - Full Stack EJS Application

This is a full-featured Express.js application with EJS templating, MongoDB integration, and complete authentication system for both customers and admins.

## Project Structure

```
F:\TEST\
├── app.js                 # Main Express application file
├── package.json           # Node.js dependencies
├── config/                # Configuration files
│   ├── development.json
│   └── custom-environment-variables.json
├── bin/
│   └── www               # Server startup script
├── models/               # MongoDB models
│   ├── User.js
│   ├── Product.js
│   └── Category.js
├── middlewares/          # Custom middleware
│   ├── sessionAuth.js
│   ├── checkSessionAuth.js
│   ├── super-admin.js
│   └── apiauth.js
├── routes/               # Application routes
│   ├── index.js          # Main routes (home, login, register)
│   ├── protected.js      # Protected customer routes
│   ├── api/              # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── catagories.js
│   │   └── public/
│   │       └── products.js
│   └── super-admin/      # Admin routes
│       ├── dashbosrd.js
│       └── products.js
├── views/
│   ├── layout.ejs        # Main layout template
│   ├── super-admin-layout.ejs  # Admin layout template
│   ├── error.ejs         # Error page template
│   ├── layouts/
│   │   └── partials/
│   │       └── header.ejs # Header partial with navigation
│   ├── site/             # Customer-facing pages
│   │   ├── homepage.ejs
│   │   ├── checkout.ejs
│   │   ├── restapi.ejs
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── myaccount.ejs
│   │   └── contact.ejs
│   └── super-admin/      # Admin pages
│       ├── dashboard.ejs
│       └── products/
│           ├── list.ejs
│           ├── create.ejs
│           └── edit.ejs
└── public/
    ├── stylesheets/
    │   └── style.css     # Main stylesheet
    └── images/
        ├── uploaded/     # User uploaded images
        └── ...           # Static images
```

## Features

### Authentication & Authorization
- **Customer Authentication** - Login/Register system for customers
- **Admin Authentication** - Role-based access control for admin panel
- **Session Management** - Express sessions for user state
- **Protected Routes** - Middleware to protect customer and admin routes
- **JWT API Authentication** - Token-based authentication for API endpoints

### Admin Panel
- **Product Management** - Full CRUD operations for products
- **Image Upload** - Multer middleware for product image uploads
- **Dashboard** - Admin dashboard with quick links
- **Role-Based Access** - Only users with "admin" role can access admin panel

### Customer Features
- **User Registration** - Create new customer accounts
- **User Login** - Secure login with bcrypt password hashing
- **My Account** - Protected customer account page
- **Session Persistence** - Stay logged in across page visits

### API Endpoints
- **Public Products API** - `/api/public/products` - Public product listing
- **Protected Products API** - `/api/products` - Requires JWT token
- **Categories API** - `/api/categories` - Category management
- **Auth API** - `/api/auth` - JWT token generation

## Installation

1. **Install MongoDB** - Make sure MongoDB is installed and running locally

2. **Install Node.js dependencies**:
```bash
npm install
```

3. **Configure MongoDB connection** - Edit `config/development.json`:
```json
{
  "db": "mongodb://localhost:27017/adagency"
}
```

## Running the Application

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The application will be available at: **http://localhost:3000**

## Creating an Admin User

To create an admin user, you can use MongoDB shell or create a script:

**Option 1: Using MongoDB Shell**
```javascript
use adagency
db.users.insertOne({
  name: "Admin User",
  email: "admin@admin.com",
  password: "$2a$10$...", // bcrypt hash of your password
  roles: ["admin"]
})
```

**Option 2: Register normally, then update via MongoDB**
1. Register a user through `/register`
2. Connect to MongoDB and update the user:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { roles: ["admin"] } }
)
```

## Available Routes

### Public Routes
- `/` - Homepage
- `/checkout` - Checkout page
- `/restapi` - REST API demo page
- `/login` - Login page
- `/register` - Registration page
- `/contact-us` - Contact page

### Protected Customer Routes
- `/my-account` - Customer account page (requires login)

### Admin Routes (requires admin role)
- `/super-admin` - Admin dashboard
- `/super-admin/products` - Product list
- `/super-admin/products/create` - Create product
- `/super-admin/products/edit/:id` - Edit product
- `/super-admin/products/delete/:id` - Delete product

### API Routes
- `POST /api/auth` - Get JWT token
- `GET /api/public/products` - Get all products (public)
- `GET /api/products` - Get all products (requires JWT)
- `POST /api/products` - Create product (requires JWT)
- `PUT /api/products/:id` - Update product (requires JWT)
- `DELETE /api/products/:id` - Delete product (requires JWT)
- `GET /api/categories` - Get all categories
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **EJS** - Embedded JavaScript templating
- **express-ejs-layouts** - Layout support
- **express-session** - Session management
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File upload handling
- **config** - Configuration management
- **Bootstrap 5** - CSS framework
- **Font Awesome 6** - Icon library
- **jQuery** - JavaScript library

## Architecture Pattern

This application follows the **MVC (Model-View-Controller)** pattern:
- **Models**: MongoDB schemas in `models/` folder
- **Views**: EJS templates in `views/` folder
- **Controllers**: Route handlers in `routes/` folder
- **Middlewares**: Custom middleware in `middlewares/` folder

## Security Features

- Password hashing with bcrypt
- Session-based authentication for web routes
- JWT token authentication for API routes
- Role-based access control (RBAC)
- Protected routes with middleware
- Input validation
- File upload security (image types only)

## Environment Configuration

The app uses the `config` package for environment-specific settings:
- `config/development.json` - Development configuration
- Environment variables can override settings via `custom-environment-variables.json`

## Development Notes

- All static HTML files have been converted to EJS templates
- MongoDB connection is configured in `config/development.json`
- Admin routes are protected by `super-admin` middleware
- Customer routes are protected by `checkSessionAuth` middleware
- Flash messages are displayed using session flash middleware
- Product images are uploaded to `public/images/uploaded/`

## Next Steps

You can extend this application by:
- Adding email verification
- Implementing password reset functionality
- Adding product categories management UI
- Creating shopping cart functionality
- Adding order management
- Implementing payment integration
- Adding user profile editing
- Creating admin user management
- Adding product search and filtering



