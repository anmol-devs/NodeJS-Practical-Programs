# Lab10: NexShop E-Commerce Application

## Project Overview
**NexShop** is a full-stack e-commerce web application built with Node.js and Express. It's a premium electronics shopping platform that demonstrates fundamental web development concepts including server-side API development, frontend-backend communication, user authentication, shopping cart management, and responsive UI design.

---

## Key Features

### 1. **Product Catalog**
- Display of 8 premium electronics products (Headphones, Apple Watch, MacBook Pro, Cameras, Gaming Console, Monitors, iPad, Keyboard)
- Product details include:
  - Product name and description
  - Price
  - High-quality product images
  - Customer ratings and review counts
- Responsive product grid layout

### 2. **Shopping Cart**
- Add products to cart with quantity management
- Real-time cart update with item count badge
- Cart persistence using browser localStorage
- View cart summary with total price calculation
- Increase/decrease item quantities
- Remove items from cart
- Cart badge displays count of items

### 3. **User Authentication**
- User registration with validation:
  - Name, Email, and Password required
  - Duplicate email prevention
  - Form validation
- User login with credentials verification
- Authentication state management
- UI updates based on authentication status (Sign In → User Name when logged in)

### 4. **Product Sorting & Filtering**
- Sort by Featured (default)
- Sort by Price: Low to High
- Sort by Price: High to Low
- Real-time product grid updates after sorting

### 5. **Responsive Design**
- Mobile-friendly layout
- Professional UI with modern styling
- Toast notifications for user feedback
- Error handling and user messages

---

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **Express** | ^5.2.1 | Web server framework |
| **CORS** | ^2.8.6 | Cross-Origin Resource Sharing |
| **HTML5** | - | Markup structure |
| **CSS3** | - | Styling and responsive design |
| **JavaScript (ES6+)** | - | Frontend interactivity |
| **Font Awesome** | 6.4.0 | Icons |
| **Google Fonts** | - | Typography (Inter font family) |

---

## Project Structure

```
Lab10/
├── package.json              # Project dependencies and metadata
├── server.js                 # Express server and API endpoints
└── public/                   # Frontend static files
    ├── index.html            # Home page with product listing
    ├── login.html            # Authentication page (Login/Register)
    ├── cart.html             # Shopping cart page
    ├── script.js             # Frontend JavaScript logic
    └── style.css             # Global styling
```

---

## Architecture

### Backend (Server-Side)
- **Express Server** running on `http://localhost:3000`
- **Static file serving** from the `public/` folder
- **RESTful API endpoints** for products, registration, and login
- **In-memory data storage** (products and users)
- **CORS enabled** for cross-origin requests

### Frontend (Client-Side)
- **Single Page Application (SPA) architecture** with multiple HTML pages
- **Vanilla JavaScript** for interactivity
- **localStorage API** for cart persistence
- **Fetch API** for HTTP requests to backend
- **DOM manipulation** for dynamic content updates

---

## API Endpoints

### 1. **GET /api/products**
- Retrieves all available products
- Returns: Array of product objects
- Response format:
  ```json
  [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product Description",
      "price": 398.00,
      "image": "https://...",
      "rating": 4.8,
      "reviews": 12450
    }
  ]
  ```

### 2. **POST /api/register**
- Create a new user account
- Request body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- Validation:
  - All fields required
  - Email must be unique
- Response:
  ```json
  {
    "success": true,
    "user": {
      "id": 1716234567890,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### 3. **POST /api/login**
- Authenticate user credentials
- Request body:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- Validation:
  - Email and password must match
- Response:
  ```json
  {
    "success": true,
    "user": {
      "id": 1716234567890,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

## Pages & Functionality

### **index.html - Home Page**
- **Navbar** with:
  - NexShop logo (with lightning bolt icon)
  - Search bar (UI only)
  - Sign In link (changes to username when logged in)
  - Cart icon with item count badge
- **Hero Section** with call-to-action
- **Product Sorting** dropdown (Featured, Price Low-to-High, Price High-to-Low)
- **Products Grid** displaying all 8 products
- **Add to Cart Button** for each product
- **Toast Notifications** for user actions

### **login.html - Authentication Page**
- **Tab Navigation** between Sign In and Register forms
- **Sign In Form**:
  - Email and Password fields
  - Form validation
  - Error messages
- **Register Form**:
  - Full Name, Email, and Password fields
  - Duplicate email prevention
  - Form validation
  - Error messages

### **cart.html - Shopping Cart**
- **Cart Items Table** showing:
  - Product image
  - Product name
  - Unit price
  - Quantity (with increase/decrease buttons)
  - Subtotal
  - Remove button
- **Cart Summary**:
  - Subtotal calculation
  - Tax calculation (assumed)
  - Total price
  - Checkout button
- **Empty Cart** message when no items

---

## Data Model

### **Product Object**
```javascript
{
  id: Number,
  name: String,
  description: String,
  price: Number,
  image: String (URL),
  rating: Number,
  reviews: Number
}
```

### **User Object**
```javascript
{
  id: Number (Timestamp),
  name: String,
  email: String,
  password: String
}
```

### **Cart Item Object**
```javascript
{
  id: Number,
  name: String,
  price: Number,
  quantity: Number,
  image: String
}
```

---

## How to Run

### Prerequisites
- Node.js installed
- npm (Node Package Manager)

### Setup Instructions

1. **Navigate to project directory:**
   ```bash
   cd "d:\Programs\College Codes\NodeJS\Lab10"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. **Access the application:**
   - Open browser and navigate to: `http://localhost:3000`
   - Homepage will load with product listings

---

## User Workflows

### **Shopping Workflow**
1. User visits homepage
2. Browses products in grid
3. Clicks "Add to Cart" on desired product
4. Cart count badge updates
5. Navigates to Cart page to review items
6. Adjusts quantities as needed
7. Proceeds to checkout

### **Authentication Workflow**
1. User clicks "Sign In" in navbar
2. Navigates to login page
3. Can either:
   - **Login**: Enter email/password for existing account
   - **Register**: Create new account with name/email/password
4. Upon successful authentication:
   - User data saved (in memory or localStorage)
   - Navbar updates to show username
   - User can proceed with shopping

### **Sorting Workflow**
1. User visits homepage
2. Selects sorting option from dropdown
3. Products re-render in selected order
4. Can change sort order anytime

---

## Key Features Implementation Details

### **localStorage for Cart Persistence**
- Cart data stored in browser with key: `nexshop_cart`
- Survives page refreshes
- Format: JSON stringified array of cart items

### **Authentication State Management**
- Current user stored in sessionStorage or localStorage
- Used to update UI (navbar auth link)
- Could be extended with JWT tokens for production

### **Responsive Design**
- Mobile-first CSS approach
- Flexbox/Grid for layouts
- Media queries for different screen sizes
- Font Awesome icons for visual consistency

---

## Current Limitations & Future Enhancements

### **Current Limitations**
1. **No Database** - Data stored in memory (resets on server restart)
2. **No Password Hashing** - Passwords stored in plain text
3. **No Session Management** - No JWT or secure session tokens
4. **No Payment Processing** - Checkout is UI only
5. **No Email Verification** - Anyone can register with any email
6. **Limited Validation** - Basic form validation only

### **Suggested Enhancements**
1. Add MongoDB/SQL database for persistent storage
2. Implement password hashing (bcrypt)
3. Add JWT authentication
4. Integrate payment gateway (Stripe, PayPal)
5. Email verification system
6. Order tracking and history
7. Product search functionality
8. User reviews and ratings system
9. Admin dashboard
10. Product inventory management

---

## Conclusion

Lab10 is an excellent foundational project for learning full-stack web development with Node.js. It demonstrates key concepts in server-side programming, REST API design, frontend-backend communication, and modern web application architecture. The project can serve as a template for building more complex e-commerce platforms with additional features and integrations.
