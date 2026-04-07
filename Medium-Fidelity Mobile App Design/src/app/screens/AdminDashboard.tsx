import { Link } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, DollarSign, Users, TrendingUp, Award } from "lucide-react";

export function AdminDashboard() {
  const pendingApprovals = [
    { id: 1, name: "Abena Asante", type: "Designer", location: "Kumasi", submitted: "2 hours ago" },
    { id: 2, name: "Kwabena Mensah", type: "Designer", location: "Accra", submitted: "5 hours ago" },
    { id: 3, name: "Esi Boateng", type: "Designer", location: "Takoradi", submitted: "1 day ago" },
  ];

  const recentTransactions = [
    { id: "TXN001", customer: "Akosua Owusu", designer: "Kwame Asante", amount: 350, status: "Completed", date: "Mar 4, 2026" },
    { id: "TXN002", customer: "Yaw Ofori", designer: "Ama Boateng", amount: 280, status: "Completed", date: "Mar 4, 2026" },
    { id: "TXN003", customer: "Efua Mensah", designer: "Kofi Owusu", amount: 520, status: "Pending", date: "Mar 3, 2026" },
  ];

  const vipDesigners = [
    { id: 1, name: "Akosua Mensah", orders: 124, rating: 4.8, earnings: "GH₵ 42,500" },
    { id: 2, name: "Kwame Asante", orders: 89, rating: 4.9, earnings: "GH₵ 38,200" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111827] to-[#4B5563] px-6 py-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <Link to="/home" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-white" style={{ fontSize: "24px", fontWeight: "700" }}>
            Admin Dashboard
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur">
            <Users size={24} className="mb-2" />
            <p className="text-white" style={{ fontSize: "24px", fontWeight: "700" }}>
              1,245
            </p>
            <p className="text-white/90 text-sm">Total Users</p>
          </div>
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur">
            <Users size={24} className="mb-2" />
            <p className="text-white" style={{ fontSize: "24px", fontWeight: "700" }}>
              89
            </p>
            <p className="text-white/90 text-sm">Active Designers</p>
          </div>
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur">
            <DollarSign size={24} className="mb-2" />
            <p className="text-white" style={{ fontSize: "24px", fontWeight: "700" }}>
              GH₵ 128K
            </p>
            <p className="text-white/90 text-sm">Total Revenue</p>
          </div>
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur">
            <TrendingUp size={24} className="mb-2" />
            <p className="text-white" style={{ fontSize: "24px", fontWeight: "700" }}>
              +24%
            </p>
            <p className="text-white/90 text-sm">Growth</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pending Approvals */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#111827]" style={{ fontSize: "20px", fontWeight: "700" }}>
              Pending Approvals
            </h2>
            <span className="px-3 py-1 bg-[#F97316] text-white rounded-full text-sm" style={{ fontWeight: "600" }}>
              {pendingApprovals.length} New
            </span>
          </div>

          <div className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[#111827] mb-1" style={{ fontWeight: "600" }}>
                      {approval.name}
                    </h3>
                    <p className="text-[#4B5563] text-sm">{approval.type} Application</p>
                    <p className="text-[#4B5563] text-sm">{approval.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#4B5563] text-sm">{approval.submitted}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    <span style={{ fontWeight: "600" }}>Approve</span>
                  </button>
                  <button className="flex-1 py-2 bg-white border border-gray-200 text-[#EF4444] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <XCircle size={16} />
                    <span style={{ fontWeight: "600" }}>Reject</span>
                  </button>
                  <button className="px-4 py-2 bg-[#EAB308] text-white rounded-lg hover:bg-[#CA9A04] transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-[#111827] mb-4" style={{ fontSize: "20px", fontWeight: "700" }}>
            Recent Transactions
          </h2>

          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[#4B5563] text-xs mb-1">{txn.id}</p>
                    <h3 className="text-[#111827] mb-1" style={{ fontWeight: "600" }}>
                      {txn.customer}
                    </h3>
                    <p className="text-[#4B5563] text-sm">Designer: {txn.designer}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      txn.status === "Completed"
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "bg-[#F97316]/10 text-[#F97316]"
                    }`} style={{ fontWeight: "600" }}>
                      {txn.status}
                    </span>
                    <p className="text-[#EAB308] mt-2" style={{ fontWeight: "700" }}>
                      GH₵ {txn.amount}
                    </p>
                  </div>
                </div>
                <p className="text-[#4B5563] text-xs">{txn.date}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 bg-white border border-gray-200 text-[#111827] rounded-xl hover:border-[#EAB308] transition-colors">
            View All Transactions
          </button>
        </div>

        {/* VIP Designer Management */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={24} className="text-[#EAB308]" />
            <h2 className="text-[#111827]" style={{ fontSize: "20px", fontWeight: "700" }}>
              VIP Designers
            </h2>
          </div>

          <div className="space-y-3">
            {vipDesigners.map((designer) => (
              <div key={designer.id} className="p-4 bg-gradient-to-r from-[#EAB308]/10 to-[#F97316]/10 border border-[#EAB308]/20 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[#111827]" style={{ fontWeight: "600" }}>
                        {designer.name}
                      </h3>
                      <Award size={16} className="text-[#EAB308]" />
                    </div>
                    <p className="text-[#4B5563] text-sm">{designer.orders} orders completed</p>
                    <p className="text-[#4B5563] text-sm">Rating: {designer.rating} ⭐</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#006D5B]" style={{ fontWeight: "700" }}>
                      {designer.earnings}
                    </p>
                    <p className="text-[#4B5563] text-xs">Total Earnings</p>
                  </div>
                </div>

                <button className="w-full py-2 bg-[#EAB308] text-white rounded-lg hover:bg-[#CA9A04] transition-colors">
                  Manage VIP Status
                </button>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 bg-white border border-gray-200 text-[#111827] rounded-xl hover:border-[#EAB308] transition-colors">
            View All Designers
          </button>
        </div>

        {/* Platform Settings */}
        <div className="space-y-3">
          <button className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-[#EAB308] transition-colors">
            <span className="text-[#111827]" style={{ fontWeight: "600" }}>
              Platform Settings
            </span>
          </button>
          <button className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-[#EAB308] transition-colors">
            <span className="text-[#111827]" style={{ fontWeight: "600" }}>
              Commission Management
            </span>
          </button>
          <button className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-[#EAB308] transition-colors">
            <span className="text-[#111827]" style={{ fontWeight: "600" }}>
              Reports & Analytics
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
