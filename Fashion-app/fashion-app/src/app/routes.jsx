import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
  { path: "/customer/home", element: <ProtectedRoute allowedRole="customer"><Home /></ProtectedRoute> },
  { path: "/home", element: <Navigate to="/customer/home" replace /> },
  { path: "/designer-home", element: <ProtectedRoute allowedRole="designer"><DesignerHome /></ProtectedRoute> },
  { path: "/designers", element: <DesignerList /> },
  { path: "/designer/:id", element: <DesignerProfile /> },
  { path: "/measurements", element: <ProtectedRoute allowedRole="customer"><UploadMeasurements /></ProtectedRoute> },
  { path: "/book/:designerId", element: <ProtectedRoute allowedRole="customer"><BookTailoring /></ProtectedRoute> },
  { path: "/payment", element: <ProtectedRoute allowedRole="customer"><Payment /></ProtectedRoute> },
  { path: "/orders", element: <ProtectedRoute allowedRole="customer"><OrderTracking /></ProtectedRoute> },
  { path: "/chat", element: <ProtectedRoute allowedRole="customer"><Chat /></ProtectedRoute> },
  { path: "/chat/:id", element: <ProtectedRoute allowedRole="customer"><Conversation /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute allowedRole="customer"><CustomerProfile /></ProtectedRoute> },
  { path: "/settings", element: <ProtectedRoute allowedRole="customer"><CustomerProfile /></ProtectedRoute> },
  { path: "/designer/dashboard", element: <ProtectedRoute allowedRole="designer"><DesignerDashboard /></ProtectedRoute> },
  { path: "/designer-dashboard", element: <Navigate to="/designer/dashboard" replace /> },
  { path: "/designer-settings", element: <ProtectedRoute allowedRole="designer"><DesignerDashboard /></ProtectedRoute> },
  { path: "/admin", element: <ProtectedRoute allowedRole="admin"><AminDashboard /></ProtectedRoute> },
  { path: "*", element: <NotFound /> },
]);