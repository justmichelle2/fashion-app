import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle2, MessageSquare, ShoppingBag, X } from "lucide-react";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "n-1",
    title: "Order accepted",
    message: "Your designer accepted order #A1284.",
    time: "5 min ago",
    unread: true,
    type: "order",
  },
  {
    id: "n-2",
    title: "New message",
    message: "Ama Boateng replied to your request.",
    time: "1 hour ago",
    unread: true,
    type: "message",
  },
  {
    id: "n-3",
    title: "Payment confirmed",
    message: "Your payment was received successfully.",
    time: "Today",
    unread: false,
    type: "payment",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "message":
      return MessageSquare;
    case "payment":
      return CheckCircle2;
    default:
      return ShoppingBag;
  }
};

export default function NotificationBell({ unreadCount, notifications, className = "" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const items = useMemo(() => notifications || DEFAULT_NOTIFICATIONS, [notifications]);
  const badgeCount = typeof unreadCount === "number" ? unreadCount : items.filter((item) => item.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 hover:bg-gray-50 rounded-xl transition-all"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell size={24} className="text-[#2D2D2D]" />
        {badgeCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#2D2D2D]">Notifications</p>
              <p className="text-xs text-gray-500">Recent updates and alerts</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-gray-100 transition"
              aria-label="Close notifications"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => {
                  const Icon = getIcon(item.type);

                  return (
                    <div
                      key={item.id}
                      className={`flex gap-3 px-4 py-4 transition ${item.unread ? "bg-[#FFF8F5]" : "bg-white"}`}
                    >
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E76F51]/10">
                        <Icon size={16} className="text-[#E76F51]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-[#2D2D2D]">{item.title}</p>
                          {item.unread && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                        <p className="mt-2 text-xs font-medium text-gray-400">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}