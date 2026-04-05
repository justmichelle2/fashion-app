<<<<<<< Updated upstream
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.jsx";
import MobileViewport from "./components/MobileViewport";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F2F2EF] flex items-center justify-center">
      <MobileViewport>
        <RouterProvider router={router} />
      </MobileViewport>
    </div>
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DesignerLogin from "./pages/DesignerLogin";
import DesignerSignup from "./pages/DesignerSignup";
import DesignerHome from "./pages/DesignerHome";
import DesignerList from "./pages/DesignerList";
import DesignerDashboard from "./pages/DesignerDashboard";
import DesignerProfile from "./pages/DesignerProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/designer-login" element={<DesignerLogin />} />
        <Route path="/designer-signup" element={<DesignerSignup />} />
        <Route path="/designer-home" element={<DesignerHome />} />
        <Route path="/designer-list" element={<DesignerList />} />
        <Route path="/designer-dashboard" element={<DesignerDashboard />} />
        <Route path="/designer-profile" element={<DesignerProfile />} />
      </Routes>
    </BrowserRouter>
>>>>>>> Stashed changes
  );
}
