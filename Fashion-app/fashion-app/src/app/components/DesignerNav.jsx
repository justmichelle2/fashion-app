import { Home, LayoutGrid, LayoutDashboard, Package, MessageCircle, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DesignerNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/designer/home" },
    { icon: LayoutGrid, label: "Portfolio", path: "/designer/portfolio" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/designer/dashboard" },
    { icon: Package, label: "Orders", path: "/designer/orders" },
    { icon: MessageCircle, label: "Chat", path: "/designer/messages" },
    { icon: Settings, label: "Settings", path: "/designer/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-area-bottom z-40 overflow-x-auto border-t border-[rgba(45,45,45,0.1)] bg-gradient-to-r from-[#2D2D2D]/85 to-[#6B6B6B]/75 backdrop-blur-lg rounded-t-3xl shadow-[0_-10px_30px_rgba(45,45,45,0.35)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 gap-1 rounded-2xl py-1.5 transition-all ${
                isActive
                  ? "bg-[#2D2D2D]/80 shadow-[0_0_16px_rgba(107,107,107,0.45)]"
                  : "bg-transparent"
              }`}
            >
              <Icon size={24} className={isActive ? "text-white" : "text-[#D1D5DB]"} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] ${isActive ? "text-white font-medium" : "text-[#E5E7EB]"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default DesignerNav;
