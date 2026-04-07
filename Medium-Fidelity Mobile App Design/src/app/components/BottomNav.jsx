import { Home, Users, Package, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Users, label: "Designers", path: "/designers" },
    { icon: Package, label: "Orders", path: "/orders" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 gap-1"
            >
              <Icon
                size={24}
                className={isActive ? "text-[#E76F51]" : "text-gray-400"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                style={{ fontSize: "11px" }}
                className={`text-xs ${
                  isActive ? "text-[#E76F51] font-medium" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
