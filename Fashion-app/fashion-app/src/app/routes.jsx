import { createBrowserRouter } from "react-router-dom";
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
import Conversation from "./pages/Conversation";
import CustomerProfile from "./pages/CustomerProfile";
import DesignerDashboard from "./pages/DesignerDashboard";
import AdminDashboard from "./pages/AminDashboard";
import NotFound from "./pages/NotFound";
import RouteError from "./pages/RouteError";
import { Navigate } from "react-router-dom";

const errorElement = <RouteError />;

export const router = createBrowserRouter([
  { path: "/", element: <Splash />, errorElement },
  { path: "/landing", element: <Landing />, errorElement },
  { path: "/login", element: <Navigate to="/login/customer" replace />, errorElement },
  { path: "/signup", element: <Navigate to="/signup/customer" replace />, errorElement },
  { path: "/designer-login", element: <Navigate to="/login/designer" replace />, errorElement },
  { path: "/designer-signup", element: <Navigate to="/signup/designer" replace />, errorElement },
  { path: "/login/customer", element: <Login />, errorElement },
  { path: "/login/designer", element: <DesignerLogin />, errorElement },
  { path: "/signup/customer", element: <Signup />, errorElement },
  { path: "/signup/designer", element: <DesignerSignup />, errorElement },
  { path: "/home", element: <Home />, errorElement },
  { path: "/dashboard", element: <Navigate to="/home" replace />, errorElement },
  { path: "/designer-home", element: <DesignerHome />, errorElement },
  { path: "/designers", element: <DesignerList />, errorElement },
  { path: "/designer/:id", element: <DesignerProfile />, errorElement },
  { path: "/measurements", element: <UploadMeasurements />, errorElement },
  { path: "/book/:designerId", element: <BookTailoring />, errorElement },
  { path: "/payment", element: <Payment />, errorElement },
  { path: "/orders", element: <OrderTracking />, errorElement },
  { path: "/orders/:id", element: <OrderTracking />, errorElement },
  { path: "/chat", element: <Chat />, errorElement },
  { path: "/chat/:id", element: <Conversation />, errorElement },
  { path: "/profile", element: <CustomerProfile />, errorElement },
  { path: "/settings", element: <CustomerProfile />, errorElement },
  { path: "/designer-dashboard", element: <DesignerDashboard />, errorElement },
  { path: "/designer-settings", element: <DesignerDashboard />, errorElement },
  { path: "/admin", element: <AdminDashboard />, errorElement },
  { path: "*", element: <NotFound />, errorElement },
]);