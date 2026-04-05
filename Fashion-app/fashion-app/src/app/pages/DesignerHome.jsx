<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp, Users, DollarSign, Clock } from "lucide-react";

export default function DesignerHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-[#E76F51] to-[#F4A261] text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-['Playfair_Display']">Welcome, Designer</h1>
            <p className="text-white/80 font-['Raleway'] text-sm">Manage your portfolio and orders</p>
          </div>
          <button
            onClick={() => navigate("/designer-dashboard")}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <TrendingUp className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Active Orders</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">12</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <Users className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Total Clients</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">48</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <DollarSign className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Monthly Earnings</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">₵5,240</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <Clock className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Avg Turnaround</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">7 days</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => navigate("/designer-dashboard")}
          className="w-full h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-['Raleway'] font-semibold text-lg shadow-lg transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Portfolio
        </button>

        <button className="w-full h-12 bg-white border-2 border-[#E76F51] text-[#E76F51] rounded-full font-['Raleway'] font-semibold hover:bg-[#E76F51]/5 transition">
          View All Orders
        </button>
      </div>

      {/* Recent Orders */}
      <div className="p-6">
        <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-[#E76F51]/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#2D2D2D] font-semibold font-['Raleway']">Custom Dress Order #{i}</h3>
                  <p className="text-[#6B6B6B] text-sm font-['Raleway']">Sarah M. • 3 days ago</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">In Progress</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
=======
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
			title: "Earnings & Payments",
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
>>>>>>> Stashed changes
}
