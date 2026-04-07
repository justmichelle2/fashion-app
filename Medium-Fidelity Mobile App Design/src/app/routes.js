import { createBrowserRouter } from "react-router";
import { Splash } from "./screens/Splash";
import { Landing } from "./screens/Landing";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { DesignerLogin } from "./screens/DesignerLogin";
import { DesignerSignup } from "./screens/DesignerSignup";
import { Home } from "./screens/Home";
import { DesignerHome } from "./screens/DesignerHome";
import { DesignerList } from "./screens/DesignerList";
import { DesignerProfile } from "./screens/DesignerProfile";
import { UploadMeasurements } from "./screens/UploadMeasurements";
import { BookTailoring } from "./screens/BookTailoring";
import { Payment } from "./screens/Payment";
import { OrderTracking } from "./screens/OrderTracking";
import { Chat } from "./screens/Chat";
import { Conversation } from "./screens/Conversation";
import { CustomerProfile } from "./screens/CustomerProfile";
import { DesignerDashboard } from "./screens/DesignerDashboard";
import { AdminDashboard } from "./screens/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/landing",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/designer-login",
    Component: DesignerLogin,
  },
  {
    path: "/designer-signup",
    Component: DesignerSignup,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/designer-home",
    Component: DesignerHome,
  },
  {
    path: "/designers",
    Component: DesignerList,
  },
  {
    path: "/designer/:id",
    Component: DesignerProfile,
  },
  {
    path: "/measurements",
    Component: UploadMeasurements,
  },
  {
    path: "/book/:designerId",
    Component: BookTailoring,
  },
  {
    path: "/payment",
    Component: Payment,
  },
  {
    path: "/orders",
    Component: OrderTracking,
  },
  {
    path: "/chat",
    Component: Chat,
  },
  {
    path: "/chat/:id",
    Component: Conversation,
  },
  {
    path: "/profile",
    Component: CustomerProfile,
  },
  {
    path: "/settings",
    Component: CustomerProfile,
  },
  {
    path: "/designer-dashboard",
    Component: DesignerDashboard,
  },
  {
    path: "/designer-settings",
    Component: DesignerDashboard,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
