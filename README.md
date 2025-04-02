# Inventory Management System

This project is a **React-based Inventory Management System** designed to streamline inventory, order, and user management for businesses. It leverages **Redux Toolkit** for state management, **Supabase** as the backend service, and includes features like real-time updates, user authentication, and detailed analytics.

---

## Features

- **User Management**: Register, login, logout, and manage user roles (admin/non-admin).
- **Inventory Management**: Add, update, and track product inventory with low-stock alerts.
- **Order Management**: Create, update, and delete orders with real-time notifications.
- **Analytics Dashboard**: Visualize sales, revenue, and inventory metrics.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Folder Structure

### `/src`

The main source folder containing all the application code.

#### 1. **`/components`**

Reusable UI components used across the application.

- **`/dashboard`**: Contains components specific to the admin dashboard, such as `Sidebar.jsx` for navigation and `OrderNotifications.jsx` for displaying order alerts.
- **`/overview`**: Contains components for the dashboard overview, such as `SalesOverview`, `OrdersOverview`, and `InventorySummary`.
- **`/tables`**: Includes table components like `InventoryTable` for displaying data in tabular format.

#### 2. **`/constants`**

Holds constant values used throughout the application.

- **`const.js`**: Contains constants like `BASE_URL` for API endpoints.

#### 3. **`/context`**

Context providers for managing global state outside of Redux.

- **`CartContext.jsx`**: Manages the shopping cart state and provides helper functions like `addItemToCart`.
- **`UseCard.js`**: A custom hook for accessing the `CartContext`.

#### 4. **`/data`**

Static data used in the application.

- **`inventory.js`**: Contains mock data for inventory items.
- **`orders.js`**: Contains mock data for orders.
- **`suppliers.js`**: Contains mock data for suppliers.

#### 5. **`/features`**

Feature-specific logic and components.

- **`/auth`**: Contains `userSlice.js` for managing user authentication and session state.
- **`/cart`**: Includes `CartOverlay.jsx` for displaying a notification when items are added to the cart and `cartSlice.js` for managing cart-related state.
- **`/admin`**: Contains admin-specific features like `AddProduct` for adding new products to the inventory.

#### 6. **`/layouts`**

Layout components for structuring pages.

- **`DashboardLayout.jsx`**: Layout for admin dashboard pages.
- **`Modal.jsx`**: A reusable modal component.
- **`ShopLayout.jsx`**: Layout for public-facing shop pages.

#### 7. **`/pages`**

Page components representing different views in the application.

- **`Overview.jsx`**: The main dashboard page showing sales, inventory, and order metrics.
- **`Inventory.jsx`**: A page for managing and viewing product inventory.
- **`Reports.jsx`**: Displays analytics and reports.
- **`Suppliers.jsx`**: Manages supplier information.
- **`Orders.jsx`**: Handles order management for admins.
- **`ProductPage.jsx`**: Displays detailed product information for admins.
- **`Settings.jsx`**: Admin settings page.
- **`FileNotFound.jsx`**: A fallback page for undefined routes.
- **`user`**: Contains user-facing pages like `LandingPage`, `ProductsPage`, `CartPage`, `PaymentPage`, and `OrderDetailsPage`.

#### 8. **`/redux`**

Redux slices and thunks for state management.

- **`authSlice.jsx`**: Handles user-related actions like login, logout, and fetching user data.
- **`cartSlice.js`**: Manages cart-related actions such as adding items to the cart and placing orders.
- **`store.js`**: Configures the Redux store and combines slices.

#### 9. **`/routes`**

Routing logic for the application.

- **`AppRoutes.jsx`**: Defines the routes for different pages in the app.
- **`ProtectedRoute.jsx`**: A higher-order component for protecting routes that require authentication.

#### 10. **`/utils`**

Utility components and helper functions.

- **`Loading.jsx`**: A reusable loading spinner component.
- **`SidebarItem.jsx`**: A helper component for rendering sidebar navigation items.

---

## Key Files

- **`App.jsx`**: The root component that initializes the app, wraps it with providers, and sets up routing.
- **`main.jsx`**: The entry point of the application, rendering the root component.
- **`index.css`**: Global styles for the application.
- **`supabaseClient.js`**: Configures and initializes the Supabase client for backend communication.

---

## How It Works

1. **Authentication**:

- Users can register, log in, and log out.
- Admins have additional privileges like managing users and inventory.

2. **Inventory Management**:

- Admins can add, update, and delete products.
- Low-stock and out-of-stock products are highlighted.

3. **Order Management**:

- Users can create and view their orders.
- Admins can manage all orders, update statuses, and delete orders.

4. **Real-Time Updates**:

- Supabase's `postgres_changes` feature is used to subscribe to real-time updates for orders.

5. **Analytics Dashboard**:

- Metrics like total revenue, sales, and top-selling products are calculated and displayed.

---

## Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/November498/inventory-management.git
cd inventory-management
```

2. Install dependencies:

```bash
npm install
```

3. Configure Supabase:

- Add your Supabase credentials in `supabaseClient.js`.

4. Start the development server:

```bash
npm start
```

---

## Technologies Used

- **Frontend**: React, Redux Toolkit, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime)
- **State Management**: Redux Toolkit, Context API
- **Routing**: React Router
- **Notifications**: React Toastify
- **Email Notifications**: Brevo

---

## Future Enhancements

- Add role-based access control for more granular permissions.
- Implement advanced analytics with charts and graphs.
- Enhance mobile responsiveness and user experience.

---

## Contributors

- **Dilafruz Abduqayumova** - Developer and Maintainer

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
