import { Home, Users, Package, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
	const location = useLocation();

	const navItems = [
		{ icon: Home, label: "Home", path: "/home" },
		{ icon: Users, label: "Designers", path: "/designers" },
		{ icon: Package, label: "Orders", path: "/orders" },
		{ icon: MessageCircle, label: "Chat", path: "/chat" },
		{ icon: User, label: "Profile", path: "/profile" },
	];

	return (
		<nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-black/5 safe-area-bottom z-20">
			<div className="flex items-center justify-around h-16 px-4">
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
								size={22}
								className={isActive ? "text-[#E76F51]" : "text-[#8B8B8B]"}
								strokeWidth={isActive ? 2.5 : 2}
							/>
							<span className={isActive ? "text-[#E76F51] text-[11px] font-medium" : "text-[#8B8B8B] text-[11px]"}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
