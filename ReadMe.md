# Ecommerce Backend

This is the backend server for a shoe store eCommerce platform, built with Node.js, Express, and MongoDB. It provides RESTful APIs for authentication, product management, cart, orders, payments, and admin operations.

## Project Structure

```
Ecommerce-Backend/
│
├── server/
│   ├── config/           # Database configuration
│   │   └── db.js
│   ├── controllers/      # Route controllers for business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── productController.js
│   ├── initial.js        # Database seeding script
│   ├── middleware/       # Express middleware (auth, error handling)
│   │   ├── auth.js
│   │   └── globalErrorHandler.js
│   ├── models/           # Mongoose models (User, Product, Order, Cart, Admin)
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── adminUser.js
│   ├── routes/           # API route definitions
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── productRoutes.js
│   ├── server.js         # Main server entry point
│   ├── services/         # Business logic/services (e.g., payment)
│   │   └── paymentService.js
│   ├── utils/            # Utility functions (error, async, JWT)
│   │   ├── appError.js
│   │   ├── catchAsync.js
│   │   └── signToken.js
│   ├── package.json      # Project metadata and dependencies
│   └── .gitignore        # Ignored files and folders
└── ReadMe.md             # Project documentation
```

## Features

- **Authentication**: User signup, login, JWT-based auth, profile retrieval
- **Product Management**: CRUD for products (admin only for create/update/delete)
- **Cart**: Add, update, remove, and clear items in user cart
- **Order Management**: Place orders, view user/admin orders, mark as paid/delivered
- **Payment Integration**: Razorpay order creation, signature verification, refunds
- **Admin Panel**: Admin login, user management, product/order management
- **Security**: Helmet, rate limiting, XSS/NoSQL injection protection, CORS
- **Error Handling**: Centralized error handler, async error wrapper

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Ecommerce-Backend/server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env` and fill in the required values:
     - `PORT`
     - `MongoDB_URI`
     - `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_COOKIE_EXPIRES_IN`
     - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
     - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - Example:

     ```env
     PORT=5000
     MongoDB_URI=mongodb://localhost:27017/shoe-store
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=7d
     JWT_COOKIE_EXPIRES_IN=7
     ADMIN_EMAIL=admin@example.com
     ADMIN_PASSWORD=yourpassword
     RAZORPAY_KEY_ID=your_razorpay_key
     RAZORPAY_KEY_SECRET=your_razorpay_secret
     ```

4. **Seed the Database (optional)**

   ```bash
   npm run seed
   ```

5. **Start the Server**
   - For development: `npm run dev`
   - For production: `npm start`

## API Overview

### Auth

- `POST /api/v1/auth/signup` — Register new user
- `POST /api/v1/auth/login` — User login
- `GET /api/v1/auth/profile` — Get user profile (auth required)

### Products

- `GET /api/v1/products` — List all products
- `POST /api/v1/products` — Create product (admin only)
- `GET /api/v1/products/:id` — Get product by ID
- `PATCH /api/v1/products/:id` — Update product (admin only)
- `DELETE /api/v1/products/:id` — Delete product (admin only)

### Cart

- `GET /api/v1/cart` — Get current user's cart
- `POST /api/v1/cart/add` — Add item to cart
- `PATCH /api/v1/cart/update` — Update item quantity
- `DELETE /api/v1/cart/remove` — Remove item from cart
- `DELETE /api/v1/cart/clear` — Clear cart

### Orders

- `POST /api/v1/orders/order` — Place order
- `GET /api/v1/orders/myOrders` — Get user's orders
- `PATCH /api/v1/orders/:id/pay` — Mark order as paid
- `GET /api/v1/orders/admin/orders` — Get all orders (admin)
- `PATCH /api/v1/orders/admin/orders/:id/deliver` — Mark as delivered (admin)

### Payments

- `POST /api/v1/payment/order` — Create Razorpay order
- `POST /api/v1/payment/signature` — Verify payment signature
- `GET /api/v1/payment/payment/:id` — Get payment details
- `POST /api/v1/payment/refund` — Refund payment
- `GET /api/v1/payment/frontend` — Get frontend payment config

### Admin

- `POST /api/v1/admin/login` — Admin login
- `GET /api/v1/admin/users` — List all users
- `PATCH /api/v1/admin/users/:id/role` — Update user role
- `DELETE /api/v1/admin/users/:id` — Delete user
- `GET /api/v1/admin/orders` — List all orders
- `PATCH /api/v1/admin/products/:id` — Update product
- `DELETE /api/v1/admin/products/:id` — Delete product

## Models

- **User**: name, email, password, role
- **Product**: name, description, price, images, brand, category, sizes, color, reviews, rating, stock
- **Order**: user, items, shipping address, total, status, payment, delivery
- **Cart**: user, items (product, quantity)
- **Admin**: Created via script/env vars

## Utilities & Middleware

- **auth.js**: JWT authentication, role-based access
- **globalErrorHandler.js**: Central error handler
- **appError.js**: Custom error class
- **catchAsync.js**: Async error wrapper
- **signToken.js**: JWT token creation and response

## Security

- Helmet, CORS, rate limiting, XSS/NoSQL injection protection

## Notes

- All sensitive config should be in `.env` (never commit this file)
- For payment, Razorpay credentials are required
- Admin user is auto-created on server start if not present

---

For more details, see code comments and each folder's files.
