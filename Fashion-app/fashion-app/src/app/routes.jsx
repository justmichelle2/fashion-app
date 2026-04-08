import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CustomerLayout from "./layouts/CustomerLayout";
import DesignerLayout from "./layouts/DesignerLayout";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DesignerLogin from "./pages/DesignerLogin";
import DesignerSignup from "./pages/DesignerSignup";
import Home from "./pages/Home";
import DesignerHome from "./pages/DesignerHome";
import DesignerList from "./pages/DesignerList";
import DesignerProfile from "./pages/DesignerProfile";
import DesignerPortfolio from "./pages/DesignerPortfolio";
import DesignerProgress from "./pages/DesignerProgress";
import DesignerOrders from "./pages/DesignerOrders";
import DesignerMessages from "./pages/DesignerMessages";
import DesignerMeasurements from "./pages/DesignerMeasurements";
import UploadMeasurements from "./pages/UploadMeasurements.jsx";
import BookTailoring from "./pages/BookTailoring";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
import Chat from "./pages/Chat";
import Conversation from "./pages/Conversation";
import CustomerProfile from "./pages/CustomerProfile";
import DesignerDashboard from "./pages/DesignerDashboard";
import AminDashboard from "./pages/AminDashboard";
import NotFound from "./pages/NotFound";

const customerRoute = (page) => (
  <ProtectedRoute allowedRole="customer" loginPath="/customer/login" fallbackPath="/designer/home">
    <CustomerLayout>{page}</CustomerLayout>
  </ProtectedRoute>
);

const designerRoute = (page) => (
  <ProtectedRoute allowedRole="designer" loginPath="/designer/login" fallbackPath="/customer/home">
    <DesignerLayout>{page}</DesignerLayout>
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  { path: "/", element: <Splash /> },
  { path: "/landing", element: <Landing /> },
  { path: "/customer/login", element: <Login /> },
  { path: "/customer/signup", element: <Signup /> },
  { path: "/designer/login", element: <DesignerLogin /> },
  { path: "/designer/signup", element: <DesignerSignup /> },
  { path: "/login", element: <Navigate to="/customer/login" replace /> },
  { path: "/signup", element: <Navigate to="/customer/signup" replace /> },
  { path: "/designer-login", element: <Navigate to="/designer/login" replace /> },
  { path: "/designer-signup", element: <Navigate to="/designer/signup" replace /> },
  { path: "/customer/home", element: customerRoute(<Home />) },
  { path: "/customer/dashboard", element: <Navigate to="/customer/home" replace /> },
  { path: "/customer/designers", element: customerRoute(<DesignerList />) },
  { path: "/customer/designer/:id", element: customerRoute(<DesignerProfile />) },
  { path: "/customer/measurements", element: customerRoute(<UploadMeasurements />) },
  { path: "/customer/book/:designerId", element: customerRoute(<BookTailoring />) },
  { path: "/customer/payment", element: customerRoute(<Payment />) },
  { path: "/customer/orders", element: customerRoute(<OrderTracking />) },
  { path: "/customer/chat", element: customerRoute(<Chat />) },
  { path: "/customer/chat/:id", element: customerRoute(<Conversation />) },
  { path: "/customer/profile", element: customerRoute(<CustomerProfile />) },
  { path: "/customer/settings", element: customerRoute(<CustomerProfile />) },
  { path: "/home", element: <Navigate to="/customer/home" replace /> },
  { path: "/designer/home", element: designerRoute(<DesignerHome />) },
  { path: "/designer/dashboard", element: designerRoute(<DesignerDashboard />) },
  { path: "/designer/portfolio", element: designerRoute(<DesignerPortfolio />) },
  { path: "/designer/orders", element: designerRoute(<DesignerOrders />) },
  { path: "/designer/progress", element: designerRoute(<DesignerProgress />) },
  { path: "/designer/messages", element: designerRoute(<DesignerMessages />) },
  { path: "/designer/measurements", element: designerRoute(<DesignerMeasurements />) },
  { path: "/designer/settings", element: designerRoute(<DesignerDashboard />) },
  { path: "/designer-home", element: <Navigate to="/designer/home" replace /> },
  { path: "/designer-dashboard", element: <Navigate to="/designer/dashboard" replace /> },
  { path: "/designer-portfolio", element: <Navigate to="/designer/portfolio" replace /> },
  { path: "/designer-progress", element: <Navigate to="/designer/progress" replace /> },
  { path: "/designer-orders", element: <Navigate to="/designer/orders" replace /> },
  { path: "/designer-messages", element: <Navigate to="/designer/messages" replace /> },
  { path: "/designer-measurements", element: <Navigate to="/designer/measurements" replace /> },
  { path: "/designer-settings", element: <Navigate to="/designer/settings" replace /> },
  { path: "/designers", element: customerRoute(<DesignerList />) },
  { path: "/designer/:id", element: customerRoute(<DesignerProfile />) },
  { path: "/measurements", element: customerRoute(<UploadMeasurements />) },
  { path: "/book/:designerId", element: customerRoute(<BookTailoring />) },
  { path: "/payment", element: customerRoute(<Payment />) },
  { path: "/orders", element: customerRoute(<OrderTracking />) },
  { path: "/chat", element: customerRoute(<Chat />) },
  { path: "/chat/:id", element: customerRoute(<Conversation />) },
  { path: "/profile", element: customerRoute(<CustomerProfile />) },
  { path: "/settings", element: customerRoute(<CustomerProfile />) },
  { path: "/admin", element: <ProtectedRoute allowedRole="admin"><AminDashboard /></ProtectedRoute> },
  { path: "*", element: <NotFound /> },
]);