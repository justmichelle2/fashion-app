import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Users, Star, Search, Package, Settings } from "lucide-react";
import { auth } from "../firebaseConfig";
import { getUserOrders } from "../utils/orderUtils";
import { getUnreadCount } from "../services/notificationsService";
import NotificationBell from "../components/NotificationBell";
import ImageWithFallback from "../components/figma/ImageWithFallback";

export default function Home() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load user profile and orders
    if (auth.currentUser) {
      setUserProfile({
        name: auth.currentUser.displayName || "Customer",
        email: auth.currentUser.email,
      });
      loadOrders();
      loadUnreadCount();

      // Refresh unread count every 30 seconds
      const interval = setInterval(() => loadUnreadCount(), 30000);
      return () => clearInterval(interval);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const result = await getUserOrders();
      if (result.success) {
        setOrders(result.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      if (auth.currentUser) {
        const count = await getUnreadCount(auth.currentUser.uid);
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const featuredDesigners = [
    {
      id: 1,
      name: "Akosua Mensah",
      specialty: "Kente & Traditional",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    },
    {
      id: 2,
      name: "Kwame Asante",
      specialty: "Contemporary Fashion",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    },
    {
      id: 3,
      name: "Ama Boateng",
      specialty: "Wedding Attire",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1726142916875-814508f61e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    },
  ];

  const styleCategories = [
    { id: 1, name: "Traditional", count: 45, icon: "👔" },
    { id: 2, name: "Modern", count: 78, icon: "✨" },
    { id: 3, name: "Formal", count: 34, icon: "🎩" },
    { id: 4, name: "Wedding", count: 56, icon: "💒" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600 mb-1 text-sm">Welcome back,</p>
            <h1 className="text-[#2D2D2D] text-2xl font-bold">
              {userProfile?.name || "Customer"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/customer/settings"
              className="p-2 hover:bg-gray-50 rounded-xl transition-all"
              aria-label="Settings"
            >
              <Settings size={22} className="text-[#2D2D2D]" />
            </Link>
            <NotificationBell unreadCount={unreadCount} />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search designers or styles..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent text-[#2D2D2D]"
          />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/measurements" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all">
            <div className="w-12 h-12 bg-[#E76F51]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Upload size={20} className="text-[#E76F51]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm font-semibold">Upload</p>
              <p className="text-gray-600 text-xs">Measurements</p>
            </div>
          </Link>

          <Link to="/orders" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-[#2D2D2D]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm font-semibold">Track</p>
              <p className="text-gray-600 text-xs">Orders</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#2D2D2D] text-lg font-bold">Your Recent Orders</h3>
              <Link to="/orders" className="text-[#E76F51] text-sm font-semibold hover:underline">View all →</Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div 
                  key={order.orderId} 
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#E76F51]/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#2D2D2D] font-semibold">Order #{order.orderId}</p>
                      <p className="text-gray-600 text-sm">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "confirmed"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status ? order.status.replace(/_/g, " ").charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[#E76F51] font-bold text-lg">
                        GHS {order.total?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Designers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2D2D2D] text-lg font-bold">Featured Designers</h3>
            <Link to="/designers" className="text-[#E76F51] text-sm font-semibold hover:underline">View all →</Link>
          </div>

          <div className="space-y-3">
            {featuredDesigners.map((designer) => (
              <Link key={designer.id} to={`/designer/${designer.id}`} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#E76F51]/30 transition-all">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex-shrink-0">
                  <ImageWithFallback src={designer.image} alt={designer.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#2D2D2D] font-semibold truncate">{designer.name}</p>
                  <p className="text-gray-600 text-sm">{designer.specialty}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star size={14} className="text-[#F4A261] fill-[#F4A261]" />
                  <span className="text-[#2D2D2D] text-sm font-semibold">{designer.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[#2D2D2D] mb-4 text-lg font-bold">Browse by Category</h3>
          <div className="grid grid-cols-2 gap-3">
            {styleCategories.map((category) => (
              <Link key={category.id} to="/designers" className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#E76F51]/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="text-[#2D2D2D] font-semibold text-sm">{category.name}</h4>
                    <p className="text-gray-600 text-xs">{category.count} designs</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[#2D2D2D] mb-4 text-lg font-bold">Your Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-600 text-sm">Total Orders</span>
              <span className="text-[#2D2D2D] font-bold text-lg">{orders.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-600 text-sm">Pending Payment</span>
              <span className="text-[#2D2D2D] font-bold text-lg">
                {orders.filter(o => o.paymentStatus === "pending").length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-600 text-sm">Total Spent</span>
              <span className="text-[#E76F51] font-bold text-lg">GHS {totalSpent.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-2xl p-6 text-white">
          <h3 className="text-white mb-2 text-lg font-bold">💡 Helpful Tip</h3>
          <p className="text-white/90 text-sm mb-4">Upload your measurements now to get faster quotes from designers!</p>
          <Link to="/measurements" className="inline-block px-6 py-2 bg-white text-[#E76F51] rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm">
            Upload Measurements
          </Link>
        </div>
      </div>

    </div>
  );
}
