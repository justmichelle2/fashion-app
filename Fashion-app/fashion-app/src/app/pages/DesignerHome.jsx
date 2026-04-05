import { Link, Navigate } from "react-router-dom";
import {
  FolderKanban,
  Images,
  Ruler,
  Timer,
  Wallet,
  Users,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, getCurrentDesigner, getEarningsSummary } from "../data/mockData";

export default function DesignerHome() {
  const designer = getCurrentDesigner();

  if (!designer) {
    return <Navigate to="/designer-login" replace />;
  }

  const earnings = getEarningsSummary(designer);
  const activeProjects = designer.projects.filter((project) => project.status === "in_progress").length;

  const featureCards = [
    {
      title: "Portfolio Management",
      description: "Upload and curate your signature design pieces.",
      icon: <Images className="w-5 h-5" />,
      value: `${designer.portfolio.length} items`,
      color: "bg-[#FFF5EE] text-[#B64A2C]",
    },
    {
      title: "Measurements Storage",
      description: "Save client specs and garment notes in one place.",
      icon: <Ruler className="w-5 h-5" />,
      value: `${designer.measurements.length} records`,
      color: "bg-[#EFF6FF] text-[#1D4ED8]",
    },
    {
      title: "Project Management",
      description: "Create and monitor every custom order lifecycle.",
      icon: <FolderKanban className="w-5 h-5" />,
      value: `${designer.projects.length} projects`,
      color: "bg-[#F0FDF4] text-[#15803D]",
    },
    {
      title: "Work In Progress",
      description: "Track all active tailoring jobs at a glance.",
      icon: <Timer className="w-5 h-5" />,
      value: `${activeProjects} active`,
      color: "bg-[#FFF7ED] text-[#C2410C]",
    },
    {
      title: "Earnings and Payments",
      description: "Follow paid and pending balances by project.",
      icon: <Wallet className="w-5 h-5" />,
      value: formatCurrency(earnings.paid),
      color: "bg-[#F5F3FF] text-[#6D28D9]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F8EFE7] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="bg-white rounded-3xl shadow-md p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#E76F51] font-semibold tracking-wide">DESIGNER SPACE</p>
              <h1 className="text-3xl font-bold text-[#2D2D2D] mt-1">Welcome, {designer.name}</h1>
              <p className="text-gray-600 mt-2 max-w-xl">
                {designer.specialty} from {designer.location}. Manage your portfolio, specifications,
                projects, and earnings from one dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/designer-profile"
                className="inline-flex items-center gap-2 border border-[#2D2D2D] text-[#2D2D2D] px-4 py-2 rounded-xl"
              >
                My Profile
              </Link>
              <Link
                to="/designer-list"
                className="inline-flex items-center gap-2 border border-[#2D2D2D] text-[#2D2D2D] px-4 py-2 rounded-xl"
              >
                <Users className="w-4 h-4" />
                Designers
              </Link>
              <Link
                to="/designer-dashboard"
                className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-4 py-2 rounded-xl"
              >
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <h2 className="text-lg font-semibold text-[#2D2D2D] mt-4">{card.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{card.description}</p>
              <p className="text-sm font-semibold text-[#2D2D2D] mt-4">{card.value}</p>
            </article>
          ))}
        </section>

        <section className="bg-[#2D2D2D] text-white rounded-3xl p-6 md:p-8">
          <h3 className="text-xl font-semibold">Quick Snapshot</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-white/70">Total Projects</p>
              <p className="text-2xl font-bold mt-1">{designer.projects.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-white/70">Pending Earnings</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(earnings.pending)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-white/70">Paid Earnings</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(earnings.paid)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
