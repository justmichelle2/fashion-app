import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  getPlatformStats,
  getAllUsers,
  getAllDesigners,
  getDesignerPerformance,
  getCustomerInsights,
  getOrderAnalytics,
  deactivateUser,
  activateUser,
  verifyDesigner,
} from "../utils/adminService";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaStar,
  FaToggleOn,
  FaToggleOff,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function AminDashboard() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dashboard data
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [insights, setInsights] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState(null);

  // Action states
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || !userProfile || userProfile.role !== "admin") {
      navigate("/home");
      return;
    }

    loadDashboardData();
  }, [currentUser, userProfile, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, usersRes, designersRes, perfRes, insightsRes, analyticsRes] =
        await Promise.all([
          getPlatformStats(),
          getAllUsers(),
          getAllDesigners(),
          getDesignerPerformance(),
          getCustomerInsights(),
          getOrderAnalytics(),
        ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (designersRes.success) setDesigners(designersRes.designers);
      if (perfRes.success) setPerformance(perfRes.performance);
      if (insightsRes.success) setInsights(insightsRes.insights);
      if (analyticsRes.success) setOrderAnalytics(analyticsRes.analytics);
    } catch (err) {
      setError("Failed to load dashboard: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm("Deactivate this user?")) return;

    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      const result = await deactivateUser(userId);
      if (result.success) {
        await loadDashboardData();
      } else {
        setError(result.error);
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      const result = await activateUser(userId);
      if (result.success) {
        await loadDashboardData();
      } else {
        setError(result.error);
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleVerifyDesigner = async (designerId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [designerId]: true }));
      const result = await verifyDesigner(designerId);
      if (result.success) {
        await loadDashboardData();
      } else {
        setError(result.error);
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [designerId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform management & analytics</p>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {["overview", "users", "designers", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-semibold capitalize ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            {stats && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Users */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {stats.users.total}
                        </p>
                      </div>
                      <FaUsers className="text-4xl text-blue-500 opacity-20" />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>👥 {stats.users.customers} Customers</p>
                      <p>✨ {stats.users.designers} Designers</p>
                    </div>
                  </div>

                  {/* Total Orders */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {stats.orders.total}
                        </p>
                      </div>
                      <FaShoppingCart className="text-4xl text-green-500 opacity-20" />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>✅ {stats.orders.completed} Completed</p>
                      <p>⏳ {stats.orders.pending} Pending</p>
                    </div>
                  </div>

                  {/* Total Revenue */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          GHS {stats.orders.revenue.toLocaleString()}
                        </p>
                      </div>
                      <FaDollarSign className="text-4xl text-green-600 opacity-20" />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Avg Order: GHS {stats.orders.averageValue.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Active Users */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Active Users</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {stats.users.active}
                        </p>
                      </div>
                      <FaCheck className="text-4xl text-purple-500 opacity-20" />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-semibold">
                        {((stats.users.active / stats.users.total) * 100).toFixed(1)}% Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Designers */}
            {stats && stats.topDesigners && stats.topDesigners.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Designers</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Designer
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topDesigners.map((designer) => (
                        <tr key={designer.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-3 text-gray-800 font-semibold">{designer.name}</td>
                          <td className="px-6 py-3 text-gray-600">{designer.orderCount}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" />
                              <span className="text-gray-800">{designer.rating.toFixed(1)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Refresh
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3 font-semibold text-gray-800">{user.name}</td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{user.email}</td>
                        <td className="px-6 py-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.active !== false
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.active !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() =>
                              user.active !== false
                                ? handleDeactivateUser(user.id)
                                : handleActivateUser(user.id)
                            }
                            disabled={actionLoading[user.id]}
                            className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-semibold transition ${
                              user.active !== false
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            } disabled:opacity-50`}
                          >
                            {user.active !== false ? (
                              <>
                                <FaToggleOff /> Deactivate
                              </>
                            ) : (
                              <>
                                <FaToggleOn /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DESIGNERS TAB */}
        {activeTab === "designers" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Designer Management</h2>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Refresh
              </button>
            </div>

            {performance && performance.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {performance.map((designer) => (
                  <div key={designer.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{designer.name}</h3>
                        <p className="text-sm text-gray-600">{designer.email}</p>
                      </div>
                      <div className="text-right">
                        {designer.verified ? (
                          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                            <FaCheck /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerifyDesigner(designer.id)}
                            disabled={actionLoading[designer.id]}
                            className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-xs font-semibold transition disabled:opacity-50"
                          >
                            <FaExclamationTriangle /> Verify
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800">{designer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{designer.completedOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaStar className="text-yellow-400" />
                          <span className="text-xl font-bold text-gray-800">
                            {designer.avgRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">
                          GHS {designer.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          designer.active
                            ? handleDeactivateUser(designer.id)
                            : handleActivateUser(designer.id)
                        }
                        disabled={actionLoading[designer.id]}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded font-semibold transition disabled:opacity-50 ${
                          designer.active
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {designer.active ? (
                          <>
                            <FaToggleOff /> Deactivate
                          </>
                        ) : (
                          <>
                            <FaToggleOn /> Activate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No designers found</p>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Order Analytics */}
            {orderAnalytics && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Orders by Status */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Orders by Status</h3>
                    <div className="space-y-3">
                      {Object.entries(orderAnalytics.byStatus).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <span className="text-gray-600 capitalize">{status}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${(count / orderAnalytics.totalOrders) * 100 || 0}%`,
                                }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-800 w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Statistics */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Price Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum</span>
                        <span className="font-semibold text-gray-800">
                          GHS {orderAnalytics.priceStats.min.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maximum</span>
                        <span className="font-semibold text-gray-800">
                          GHS {orderAnalytics.priceStats.max.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average</span>
                        <span className="font-semibold text-gray-800">
                          GHS {orderAnalytics.priceStats.average.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="text-gray-600 font-semibold">Total Revenue</span>
                        <span className="font-bold text-green-600 text-lg">
                          GHS {orderAnalytics.priceStats.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Insights */}
            {insights && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{insights.totalCustomers}</p>
                    <p className="text-sm text-green-600 mt-2">Active: {insights.activeCustomers}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm">Repeat Customers</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{insights.repeatCustomers}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {insights.totalCustomers > 0
                        ? `${((insights.repeatCustomers / insights.totalCustomers) * 100).toFixed(1)}% of total`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm">Avg Orders Per Customer</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {insights.avgOrdersPerCustomer.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Total Spent: GHS {insights.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
