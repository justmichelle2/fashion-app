import { createBrowserRouter } from "react-router-dom";
import Splash from "./screens/Splash";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import DesignerLogin from "./screens/DesignerLogin";
import DesignerSignup from "./screens/DesignerSignup";
import Home from "./screens/Home";
import DesignerHome from "./screens/DesignerHome";
import DesignerList from "./screens/DesignerList";
import DesignerProfile from "./screens/DesignerProfile";
import UploadMeasurements from "./screens/UploadMeasurements";
import BookTailoring from "./screens/BookTailoring";
import Payment from "./screens/Payment";
import OrderTracking from "./screens/OrderTracking";
import Chat from "./screens/Chat";
import Conversation from "./screens/Conversation";
import CustomerProfile from "./screens/CustomerProfile";
import DesignerDashboard from "./screens/DesignerDashboard";
import AdminDashboard from "./screens/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Splash /> },
  { path: "/landing", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/designer-login", element: <DesignerLogin /> },
  { path: "/designer-signup", element: <DesignerSignup /> },
  { path: "/home", element: <Home /> },
  { path: "/designer-home", element: <DesignerHome /> },
  { path: "/designers", element: <DesignerList /> },
  { path: "/designer/:id", element: <DesignerProfile /> },
  { path: "/measurements", element: <UploadMeasurements /> },
  { path: "/book/:designerId", element: <BookTailoring /> },
  { path: "/payment", element: <Payment /> },
  { path: "/orders", element: <OrderTracking /> },
  { path: "/chat", element: <Chat /> },
  { path: "/chat/:id", element: <Conversation /> },
  { path: "/profile", element: <CustomerProfile /> },
  { path: "/settings", element: <CustomerProfile /> },
  { path: "/designer-dashboard", element: <DesignerDashboard /> },
  { path: "/designer-settings", element: <DesignerDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },
]);