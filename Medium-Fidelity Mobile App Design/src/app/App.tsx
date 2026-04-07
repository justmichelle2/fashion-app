import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[393px] min-h-screen bg-white shadow-2xl overflow-hidden">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}