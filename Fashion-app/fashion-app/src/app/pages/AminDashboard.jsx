import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, DollarSign, Users, TrendingUp, Award } from "lucide-react";

export default function AminDashboard() {
	const pendingApprovals = [
		{ id: 1, name: "Abena Asante", type: "Designer", location: "Kumasi", submitted: "2 hours ago" },
		{ id: 2, name: "Kwabena Mensah", type: "Designer", location: "Accra", submitted: "5 hours ago" },
	];

	const recentTransactions = [
		{ id: "TXN001", customer: "Akosua Owusu", designer: "Kwame Asante", amount: 350, status: "Completed", date: "Mar 4, 2026" },
		{ id: "TXN002", customer: "Yaw Ofori", designer: "Ama Boateng", amount: 280, status: "Completed", date: "Mar 4, 2026" },
	];

	return (
		<div className="min-h-screen bg-[#FDFDFD] pb-6">
			<div className="bg-gradient-to-r from-[#111827] to-[#4B5563] px-6 py-6 text-white">
				<div className="flex items-center justify-between mb-6">
					<Link to="/home" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
						<ArrowLeft size={24} />
					</Link>
					<h1 className="text-white text-[24px] font-bold">Admin Dashboard</h1>
					<div className="w-10" />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="p-4 bg-white/20 rounded-xl backdrop-blur"><Users size={24} className="mb-2" /><p className="text-white text-[24px] font-bold">1,245</p><p className="text-white/90 text-sm">Total Users</p></div>
					<div className="p-4 bg-white/20 rounded-xl backdrop-blur"><Users size={24} className="mb-2" /><p className="text-white text-[24px] font-bold">89</p><p className="text-white/90 text-sm">Active Designers</p></div>
					<div className="p-4 bg-white/20 rounded-xl backdrop-blur"><DollarSign size={24} className="mb-2" /><p className="text-white text-[24px] font-bold">GH₵ 128K</p><p className="text-white/90 text-sm">Total Revenue</p></div>
					<div className="p-4 bg-white/20 rounded-xl backdrop-blur"><TrendingUp size={24} className="mb-2" /><p className="text-white text-[24px] font-bold">+24%</p><p className="text-white/90 text-sm">Growth</p></div>
				</div>
			</div>

			<div className="px-6 py-6 space-y-6">
				<div className="bg-white border border-gray-200 rounded-2xl p-6">
					<h2 className="text-[#111827] mb-4 text-[20px] font-bold">Pending Approvals</h2>
					<div className="space-y-3">
						{pendingApprovals.map((approval) => (
							<div key={approval.id} className="p-4 bg-gray-50 rounded-xl">
								<div className="flex items-start justify-between mb-3">
									<div><h3 className="text-[#111827] mb-1 font-semibold">{approval.name}</h3><p className="text-[#4B5563] text-sm">{approval.type} • {approval.location}</p></div>
									<p className="text-[#4B5563] text-sm">{approval.submitted}</p>
								</div>
								<div className="flex gap-2">
									<button className="flex-1 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2"><CheckCircle size={16} /><span>Approve</span></button>
									<button className="flex-1 py-2 bg-white border border-gray-200 text-[#EF4444] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><XCircle size={16} /><span>Reject</span></button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white border border-gray-200 rounded-2xl p-6">
					<div className="flex items-center gap-2 mb-4">
						<Award size={24} className="text-[#EAB308]" />
						<h2 className="text-[#111827] text-[20px] font-bold">Recent Transactions</h2>
					</div>
					<div className="space-y-3">
						{recentTransactions.map((txn) => (
							<div key={txn.id} className="p-4 bg-gray-50 rounded-xl">
								<div className="flex items-start justify-between mb-2">
									<div><p className="text-[#4B5563] text-xs mb-1">{txn.id}</p><h3 className="text-[#111827] mb-1 font-semibold">{txn.customer}</h3><p className="text-[#4B5563] text-sm">Designer: {txn.designer}</p></div>
									<p className="text-[#EAB308] font-bold">GH₵ {txn.amount}</p>
								</div>
								<p className="text-[#4B5563] text-xs">{txn.date}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
