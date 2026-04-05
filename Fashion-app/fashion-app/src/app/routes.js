import { createBrowserRouter } from "react-router-dom";
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
import UploadMeasurements from "./pages/UploadMeasurements";
import BookTailoring from "./pages/BookTailoring";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
import Chat from "./pages/Chat";
import CustomerProfile from "./pages/CustomerProfile";
import DesignerDashboard from "./pages/DesignerDashboard";
import AminDashboard from "./pages/AminDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Splash /> },
  { path: "/landing", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/designer-login", element: <DesignerLogin /> },
  { path: "/designer-signup", element: <DesignerSignup /> },
  { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: "/designer-home", element: <ProtectedRoute><DesignerHome /></ProtectedRoute> },
  { path: "/designers", element: <DesignerList /> },
  { path: "/designer/:id", element: <DesignerProfile /> },
  { path: "/measurements", element: <ProtectedRoute><UploadMeasurements /></ProtectedRoute> },
  { path: "/book/:designerId", element: <ProtectedRoute><BookTailoring /></ProtectedRoute> },
  { path: "/payment", element: <ProtectedRoute><Payment /></ProtectedRoute> },
  { path: "/orders", element: <ProtectedRoute><OrderTracking /></ProtectedRoute> },
  { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><CustomerProfile /></ProtectedRoute> },
  { path: "/settings", element: <ProtectedRoute><CustomerProfile /></ProtectedRoute> },
  { path: "/designer-dashboard", element: <ProtectedRoute><DesignerDashboard /></ProtectedRoute> },
  { path: "/designer-settings", element: <ProtectedRoute><DesignerDashboard /></ProtectedRoute> },
  { path: "/admin", element: <ProtectedRoute><AminDashboard /></ProtectedRoute> },
]);