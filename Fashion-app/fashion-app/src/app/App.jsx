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
  );
}
