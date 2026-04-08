import { Home, LayoutGrid, LayoutDashboard, Package, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DesignerNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/designer/home" },
    { icon: LayoutGrid, label: "Portfolio", path: "/designer/portfolio" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/designer/dashboard" },
    { icon: Package, label: "Orders", path: "/designer/orders" },
    { icon: MessageCircle, label: "Messages", path: "/designer/messages" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center flex-1 gap-1">
              <Icon size={24} className={isActive ? "text-[#E76F51]" : "text-gray-400"} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] ${isActive ? "text-[#E76F51] font-medium" : "text-gray-500"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default DesignerNav;
