import { Link, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronRight, Users, Wallet, CalendarClock, MessageSquare, PackageCheck } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

function GlassCard({ className = "", children }) {
  return (
    <div
      className={`rounded-3xl border border-[rgba(45,45,45,0.1)] bg-[#2D2D2D]/65 shadow-[0_10px_40px_rgba(45,45,45,0.28)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function DesignerHome() {
  const location = useLocation();
  const { userProfile } = useContext(AuthContext);

  const quickTabs = [
    { label: "Bookings", path: "/designer/orders" },
    { label: "Customers", path: "/designer/messages" },
    { label: "Earnings", path: "/designer/dashboard" },
    { label: "Availability", path: "/designer/measurements" },
    { label: "Messages", path: "/designer/messages" },
  ];

  const customerCards = [
    { id: "c1", name: "Amina Boateng", bookingDate: "Apr 08, 2026" },
    { id: "c2", name: "Efua Mensah", bookingDate: "Apr 06, 2026" },
    { id: "c3", name: "Yaw Ofori", bookingDate: "Apr 04, 2026" },
  ];

  const upcomingPreview = [
    { id: "b1", title: "Bridal Fitting", when: "Today, 4:30 PM", path: "/designer/orders" },
    { id: "b2", title: "Suit Alteration", when: "Tomorrow, 10:00 AM", path: "/designer/orders" },
    { id: "b3", title: "Final Pickup", when: "Fri, 1:15 PM", path: "/designer/progress" },
  ];

  const designerName = (userProfile?.name || userProfile?.businessName || "Designer").split(" ")[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#ffffff] pb-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lobster&family=Monoton&display=swap');`}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-[#ffffff]/10 blur-3xl" />
        <div className="absolute right-0 top-28 h-64 w-64 rounded-full bg-[#6B6B6B]/35 blur-3xl" />
        <div className="absolute bottom-10 left-16 h-52 w-52 rounded-full bg-[#2D2D2D]/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-5 py-6 space-y-5">
        <GlassCard className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/75" style={{ fontFamily: '"Monoton", "Raleway", sans-serif' }}>
                Studio Home
              </p>
              <h1 className="mt-2 text-4xl leading-none text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>
                Hi, {designerName}
              </h1>
              <p className="mt-2 text-sm text-white/80">Welcome back. Your atelier is glowing today.</p>
            </div>

            <NotificationBell
              to="/designer/notifications"
              unreadCount={1}
              className="rounded-xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 hover:bg-[#6B6B6B]/60"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 px-3 py-2">
              <Search size={16} className="text-white/80" />
              <input
                type="text"
                placeholder="Search clients, bookings, looks"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
              />
            </div>
            <Link
              to="/designer/dashboard"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 text-white shadow-[0_6px_16px_rgba(45,45,45,0.2)]"
              aria-label="Quick actions"
            >
              <SlidersHorizontal size={16} />
            </Link>
          </div>
        </GlassCard>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {quickTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.label}
                to={tab.path}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition-all ${
                  isActive
                    ? "border-[#2D2D2D] bg-[#2D2D2D] text-white shadow-[0_8px_20px_rgba(45,45,45,0.25)]"
                    : "border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 text-white"
                }`}
                style={{ fontFamily: '"Monoton", "Raleway", sans-serif', letterSpacing: "0.06em" }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/designer/portfolio"
            className="rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/40 p-4 shadow-[0_8px_24px_rgba(45,45,45,0.2)] backdrop-blur-xl"
          >
            <p className="text-xs text-white/80" style={{ fontFamily: '"Monoton", "Raleway", sans-serif', letterSpacing: "0.05em" }}>
              QUICK LINK
            </p>
            <p className="mt-2 text-lg text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>
              Portfolio
            </p>
            <p className="text-xs text-white/75">Curate your latest work</p>
          </Link>

          <Link
            to="/designer/measurements"
            className="rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/40 p-4 shadow-[0_8px_24px_rgba(45,45,45,0.2)] backdrop-blur-xl"
          >
            <p className="text-xs text-white/80" style={{ fontFamily: '"Monoton", "Raleway", sans-serif', letterSpacing: "0.05em" }}>
              QUICK LINK
            </p>
            <p className="mt-2 text-lg text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>
              Measurements
            </p>
            <p className="text-xs text-white/75">Keep fit details tidy</p>
          </Link>
        </div>

        <GlassCard className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-white/80" style={{ fontFamily: '"Monoton", "Raleway", sans-serif' }}>
                Featured Summary
              </p>
              <h2 className="mt-2 text-2xl text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>
                Atelier Snapshot
              </h2>
            </div>
            <PackageCheck size={20} className="text-white" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 p-3">
              <p className="text-xs text-white/80" style={{ fontFamily: '"Monoton", "Raleway", sans-serif' }}>Today</p>
              <p className="mt-1 text-2xl text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>6</p>
              <p className="text-xs text-white/75">Bookings</p>
            </div>
            <div className="rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 p-3">
              <p className="text-xs text-white/80" style={{ fontFamily: '"Monoton", "Raleway", sans-serif' }}>Earnings</p>
              <p className="mt-1 text-2xl text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>GHS 2.8k</p>
              <p className="text-xs text-white/75">This week</p>
            </div>
            <div className="rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 p-3">
              <p className="text-xs text-white/80" style={{ fontFamily: '"Monoton", "Raleway", sans-serif' }}>Pending</p>
              <p className="mt-1 text-2xl text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>4</p>
              <p className="text-xs text-white/75">Requests</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>Your Customers</h3>
            <Link
              to="/designer/messages"
              className="text-xs text-white"
              style={{ fontFamily: '"Monoton", "Raleway", sans-serif', letterSpacing: "0.06em" }}
            >
              VIEW ALL
            </Link>
          </div>

          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
            {customerCards.map((customer) => (
              <div
                key={customer.id}
                className="min-w-[190px] rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 p-3 shadow-[0_8px_20px_rgba(45,45,45,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D2D2D]/35 text-sm text-white">
                    {customer.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{customer.name}</p>
                    <p className="text-xs text-white/75">Last booking: {customer.bookingDate}</p>
                  </div>
                </div>
                <Link
                  to="/designer/messages"
                  className="mt-3 inline-flex items-center gap-1 rounded-full border border-[rgba(45,45,45,0.1)] bg-[#2D2D2D]/40 px-3 py-1.5 text-xs text-white"
                  style={{ fontFamily: '"Monoton", "Raleway", sans-serif', letterSpacing: "0.06em" }}
                >
                  View <ChevronRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xl text-white" style={{ fontFamily: '"Lobster", "Playfair Display", serif' }}>
              Activity Preview
            </h3>
            <Link
              to="/designer/orders"
              className="text-xs text-white"
              style={{ fontFamily: '"Monoton", "Raleway", sans-serif', letterSpacing: "0.06em" }}
            >
              OPEN BOOKINGS
            </Link>
          </div>

          <div className="space-y-2">
            {upcomingPreview.map((item, idx) => (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center justify-between rounded-2xl border border-[rgba(45,45,45,0.1)] bg-[#6B6B6B]/45 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2D2D2D]/35 text-white">
                    {idx === 0 ? <CalendarClock size={15} /> : idx === 1 ? <Wallet size={15} /> : <Users size={15} />}
                  </div>
                  <div>
                    <p className="text-sm text-white">{item.title}</p>
                    <p className="text-xs text-white/75">{item.when}</p>
                  </div>
                </div>
                <MessageSquare size={14} className="text-white/70" />
              </Link>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
