import { Home, Users, Package, MessageCircle, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function CustomerNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/customer/home" },
    { icon: Users, label: "Designers", path: "/customer/designers" },
    { icon: Package, label: "Orders", path: "/customer/orders" },
    { icon: MessageCircle, label: "Chat", path: "/customer/chat" },
    { icon: User, label: "Profile", path: "/customer/profile" },
    { icon: Settings, label: "Settings", path: "/customer/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-area-bottom z-40 overflow-x-auto border-t border-white/25 bg-[#ffc7a1] backdrop-blur-lg rounded-t-3xl shadow-[0_-8px_24px_rgba(249,115,22,0.32)]">
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
                  ? "bg-[#ef7244]/35 shadow-[0_0_14px_rgba(249,115,22,0.45)]"
                  : "bg-transparent"
              }`}
            >
              <Icon size={24} className={isActive ? "text-white" : "text-white/85"} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] ${isActive ? "text-white font-medium" : "text-white/85"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default CustomerNav;
