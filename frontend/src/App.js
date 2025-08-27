import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { checkToken } from "./components/checkToken"; // your helper

// Admin pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddFigurine from "./pages/AddFigurine";
import FigurinesList from "./pages/FigurinesList";
import EditFigurine from "./pages/EditFigurine";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";

// Customer pages
import CustomerFigurinesList from "./pages/CustomerFigurinesList";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import FigurineDetails from "./pages/FigurineDetails";
import OrderConfirmation from "./pages/OrderConfirmation";

// Components
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Context
import { CartProvider } from "./context/CartContext";

// Layouts
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Chatbot />
    <ScrollToTop />
    <Footer />
  </>
);

const AdminLayout = ({ children }) => <>{children}</>;

// Periodic token check (optional but recommended)
const useTokenCheck = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      checkToken(); // will remove token & redirect if expired
    }, 60000); // every 60 seconds

    // also check on mount
    checkToken();

    return () => clearInterval(interval);
  }, []);
};

function App() {
  useTokenCheck();

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* --- Admin Routes --- */}
          <Route
            path="/login123456789"
            element={
              <AdminLayout>
                <Login />
              </AdminLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/figurines"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <FigurinesList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-figurine"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AddFigurine />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <OrdersList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/figurines/edit/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <EditFigurine />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <OrderDetails />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* --- Customer Routes --- */}
          <Route
            path="/"
            element={
              <CustomerLayout>
                <CustomerFigurinesList />
              </CustomerLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <CustomerLayout>
                <CartPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <CustomerLayout>
                <CheckoutPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/figurines/:id"
            element={
              <CustomerLayout>
                <FigurineDetails />
              </CustomerLayout>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <CustomerLayout>
                <OrderConfirmation />
              </CustomerLayout>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
