import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";

const PLACEHOLDER_NOTIFICATIONS = [
  {
    id: "dn-1",
    title: "New booking request",
    message: "You received a new tailoring booking from a customer.",
    time: "Just now",
  },
  {
    id: "dn-2",
    title: "Order update",
    message: "Order #A1284 moved to pending payment.",
    time: "1h ago",
  },
  {
    id: "dn-3",
    title: "Message received",
    message: "A customer sent you a follow-up question.",
    time: "Today",
  },
];

export default function DesignerNotifications() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-2xl px-5 py-6">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 hover:bg-white transition"
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-[#2D2D2D]" />
          </button>
          <h1 className="text-2xl font-bold text-[#2D2D2D]">Notifications</h1>
        </div>

        <div className="space-y-3">
          {PLACEHOLDER_NOTIFICATIONS.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-[#E63946]/10 p-2 text-[#E63946]">
                  <Bell size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#2D2D2D]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#2D3436]">{item.message}</p>
                  <p className="mt-2 text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
