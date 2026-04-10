import { Link, useNavigate } from "react-router-dom";
import { Package, CheckCircle, DollarSign, Star, TrendingUp, Clock, MessageCircle, ChevronRight, Bell } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUnreadCount } from "../services/notificationsService";
import { db } from "../firebaseConfig";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function DesignerDashboard() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("progress");
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [customerMessages, setCustomerMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      if (currentUser?.uid) {
        const count = await getUnreadCount(currentUser.uid);
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  const [weeklyEarnings, setWeeklyEarnings] = useState([
    { day: "Mon", amount: 0 },
    { day: "Tue", amount: 0 },
    { day: "Wed", amount: 0 },
    { day: "Thu", amount: 0 },
    { day: "Fri", amount: 0 },
    { day: "Sat", amount: 0 },
    { day: "Sun", amount: 0 },
  ]);

  const portfolioImages = [
    "https://images.unsplash.com/photo-1733324961705-97bd6cd7f4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1763823132521-72f373850de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1733324961705-97bd6cd7f4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  ];

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Real-time listener for orders
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(
      ordersRef,
      where("designerId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Separate into pending and active
      const pending = orders.filter(o => o.status === "pending").slice(0, 3);
      const active = orders.filter(o => ["confirmed", "in-progress"].includes(o.status)).slice(0, 3);
      
      setIncomingOrders(pending.map(o => ({
        id: o.id,
        customer: o.customerName || "Unknown Customer",
        style: o.title || o.description || "Custom Design",
        amount: o.budget || o.price || 0,
        date: o.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString()
      })));

      setActiveOrders(active.map(o => ({
        id: o.id,
        customer: o.customerName || "Unknown Customer",
        style: o.title || o.description || "Custom Design",
        status: o.status === "in-progress" ? "Sewing" : "Confirmed",
        amount: o.budget || o.price || 0,
        progress: o.status === "confirmed" ? 25 : o.status === "in-progress" ? 60 : 100
      })));

      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    // Real-time listener for conversations
    const conversationsRef = collection(db, "conversations");
    const convQuery = query(
      conversationsRef,
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribeConversations = onSnapshot(convQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const otherParticipant = data.participants?.find(p => p !== currentUser.uid);
        return {
          id: doc.id,
          customer: data.participantNames?.[otherParticipant] || "Customer",
          lastMessage: data.lastMessage || "No messages yet",
          timestamp: data.updatedAt?.toDate?.()?.toLocaleTimeString() || "just now",
          unread: data.unreadCount?.[currentUser.uid] || 0,
          orderId: data.orderId || "",
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        };
      }).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
      
      setCustomerMessages(messages);
    }, (error) => {
      console.error("Error fetching conversations:", error);
    });

    loadUnreadCount();
    const interval = setInterval(() => loadUnreadCount(), 30000);

    // Cleanup subscriptions
    return () => {
      unsubscribeOrders();
      unsubscribeConversations();
      clearInterval(interval);
    };
  }, [currentUser]);

  const maxEarnings = Math.max(...weeklyEarnings.map(e => e.amount), 1);

  return (
    <div className="min-h-screen bg-[#ffffff] pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-[#2D2D2D]/75 backdrop-blur-lg px-6 py-6 border-b border-[rgba(45,45,45,0.1)] rounded-b-3xl shadow-[0_8px_24px_rgba(45,45,45,0.35)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/75 mb-1 text-sm">Operations Hub</p>
              <h1 className="text-white font-['Playfair_Display']" style={{ fontSize: "28px", fontWeight: "700" }}>
                {userProfile?.businessName || userProfile?.name || "Dashboard"}
              </h1>
            </div>
            <Link to="/designer/notifications" className="p-2 hover:bg-white/10 rounded-xl transition-all relative">
              <Bell size={24} className="text-white" />
              {unreadCount > 0 && (
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#6B6B6B] rounded-full border-2 border-white"></div>
              )}
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="bg-gradient-to-br from-[#2D2D2D] to-[#6B6B6B] rounded-3xl p-6 border border-[rgba(45,45,45,0.1)] shadow-[0_10px_28px_rgba(45,45,45,0.3)]">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Package size={20} className="text-white" />
                </div>
                <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                  {activeOrders.length}
                </p>
                <p className="text-white/90 text-xs">Active</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock size={20} className="text-white" />
                </div>
                <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                  {incomingOrders.length}
                </p>
                <p className="text-white/90 text-xs">Pending</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                  {customerMessages.length}
                </p>
                <p className="text-white/90 text-xs">Messages</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Star size={20} className="text-white" />
                </div>
                <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                  {userProfile?.rating?.toFixed(1) || "0.0"}
                </p>
                <p className="text-white/90 text-xs">Rating</p>
              </div>
            </div>
          </div>

          {/* Tab Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mt-6">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap ${
                activeTab === "progress"
                  ? "bg-[#2D2D2D] text-white shadow-[0_0_16px_rgba(107,107,107,0.45)]"
                  : "bg-[#6B6B6B]/45 text-white/90 hover:bg-[#6B6B6B]/60"
              }`}
              style={{ fontWeight: "600" }}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap ${
                activeTab === "orders"
                  ? "bg-[#2D2D2D] text-white shadow-[0_0_16px_rgba(107,107,107,0.45)]"
                  : "bg-[#6B6B6B]/45 text-white/90 hover:bg-[#6B6B6B]/60"
              }`}
              style={{ fontWeight: "600" }}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap ${
                activeTab === "messages"
                  ? "bg-[#2D2D2D] text-white shadow-[0_0_16px_rgba(107,107,107,0.45)]"
                  : "bg-[#6B6B6B]/45 text-white/90 hover:bg-[#6B6B6B]/60"
              }`}
              style={{ fontWeight: "600" }}
            >
              Messages
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
        {/* Progress Tab */}
        {activeTab === "progress" && (
          <>
            {/* This Week Earnings Chart */}
            <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
              <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                This week
              </h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-white/80 text-xs mb-1">Revenue</p>
                  <p className="text-white font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                    GH₵2.4K
                  </p>
                </div>
                <div>
                  <p className="text-white/80 text-xs mb-1">Orders</p>
                  <p className="text-white font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                    12
                  </p>
                </div>
                <div>
                  <p className="text-white/80 text-xs mb-1">Avg. Value</p>
                  <p className="text-white font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                    GH₵200
                  </p>
                </div>
              </div>

              {/* Earnings Chart */}
              <div className="relative h-40 flex items-end justify-between gap-2">
                {weeklyEarnings.map((stat, index) => (
                  <div key={stat.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-32">
                      <div
                        className="w-full bg-gradient-to-t from-[#2D2D2D] to-[#6B6B6B] rounded-t-lg transition-all relative group"
                        style={{ height: `${(stat.amount / maxEarnings) * 100}%`, minHeight: stat.amount > 0 ? '15%' : '0%' }}
                      >
                        {stat.amount > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-[#6B6B6B] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                              GH₵{stat.amount}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-white/80 text-xs">{stat.day}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white" style={{ fontSize: "18px", fontWeight: "700" }}>
                  Goals
                </h3>
                <button className="text-white text-sm" style={{ fontWeight: "600" }}>
                  See all →
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6B6B6B]/40 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white" style={{ fontWeight: "600" }}>
                        Earn GH₵5,000 this month
                      </p>
                      <span className="text-white text-sm" style={{ fontWeight: "700" }}>GH₵3.2K</span>
                    </div>
                    <div className="w-full h-2 bg-[#6B6B6B]/35 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2D2D2D] to-[#6B6B6B]" style={{ width: "64%" }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6B6B6B]/40 flex items-center justify-center flex-shrink-0">
                    <Star size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white" style={{ fontWeight: "600" }}>
                        Maintain 4.8+ rating
                      </p>
                      <span className="text-white text-sm" style={{ fontWeight: "700" }}>4.8</span>
                    </div>
                    <div className="w-full h-2 bg-[#6B6B6B]/35 rounded-full overflow-hidden">
                      <div className="h-full bg-[#6B6B6B]" style={{ width: "96%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Showcase */}
            <Link
              to="/designer-portfolio"
              className="block bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white" style={{ fontSize: "18px", fontWeight: "700" }}>
                    Portfolio
                  </h3>
                  <p className="text-white/80 text-sm mt-1">Upload and manage your designs</p>
                </div>
                <ChevronRight size={24} className="text-white" />
              </div>
            </Link>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            {/* New Orders */}
            <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white" style={{ fontSize: "18px", fontWeight: "700" }}>
                  New Orders
                </h3>
                <span className="px-3 py-1 bg-[#2D2D2D] text-white rounded-full text-xs" style={{ fontWeight: "600" }}>
                  {incomingOrders.length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {incomingOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package size={40} className="text-white/70 mx-auto mb-3" />
                    <p className="text-white/85 text-sm">No new orders yet</p>
                    <p className="text-white/65 text-xs mt-1">When customers book your services, they'll appear here</p>
                  </div>
                ) : (
                  incomingOrders.map((order, index) => (
                    <div key={order.id} className="p-4 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)] backdrop-blur-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2D2D2D] to-[#6B6B6B] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white mb-0.5" style={{ fontWeight: "600" }}>
                            {order.customer}
                          </p>
                          <p className="text-white/80 text-sm">{order.style}</p>
                          <p className="text-white/70 text-xs">Order #{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                            GH₵{order.amount}
                          </p>
                          <p className="text-white/70 text-xs">{order.date}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-[#6B6B6B] text-white rounded-xl hover:bg-[#5B5B57] transition-all flex items-center justify-center gap-2">
                          <CheckCircle size={16} />
                          <span style={{ fontWeight: "600" }}>Accept</span>
                        </button>
                        <button className="flex-1 py-2 bg-[#2D2D2D]/35 border border-[rgba(45,45,45,0.1)] text-white rounded-xl hover:bg-[#2D2D2D]/55 transition-all flex items-center justify-center gap-2">
                          <XCircle size={16} />
                          <span style={{ fontWeight: "600" }}>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Active Orders */}
            <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
              <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                Active Orders
              </h3>

              <div className="space-y-3">
                {activeOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle size={40} className="text-white/70 mx-auto mb-3" />
                    <p className="text-white/85 text-sm">No active orders</p>
                    <p className="text-white/65 text-xs mt-1">Orders you accept will appear here</p>
                  </div>
                ) : (
                  activeOrders.map((order, index) => (
                    <div key={order.id} className="p-4 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)] backdrop-blur-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2D2D2D] to-[#6B6B6B] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white mb-0.5" style={{ fontWeight: "600" }}>
                            {order.customer}
                          </p>
                          <p className="text-white/80 text-sm">{order.style}</p>
                          <p className="text-white/70 text-xs">Order #{order.id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs mb-1 inline-block ${
                            order.status === "Ready"
                              ? "bg-[#6B6B6B]/45 text-white"
                              : order.status === "Sewing"
                              ? "bg-[#2D2D2D]/45 text-white"
                              : "bg-[#6B6B6B]/45 text-white"
                          }`} style={{ fontWeight: "600" }}>
                            {order.status}
                          </span>
                          <p className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                            GH₵{order.amount}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/80 text-xs">Progress</span>
                          <span className="text-white text-xs" style={{ fontWeight: "600" }}>{order.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#6B6B6B]/35 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#2D2D2D] to-[#6B6B6B] transition-all"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>

                      <button className="w-full py-2 bg-[#2D2D2D] text-white rounded-xl hover:bg-[#1F1F1F] transition-all" style={{ fontWeight: "600" }}>
                        Update Status
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <>
            {/* Customer Conversations */}
            <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white" style={{ fontSize: "18px", fontWeight: "700" }}>
                  Conversations
                </h3>
                <span className="px-3 py-1 bg-[#2D2D2D] text-white rounded-full text-xs" style={{ fontWeight: "600" }}>
                  {customerMessages.filter(m => m.unread > 0).length} Unread
                </span>
              </div>

              <div className="space-y-3">
                {customerMessages.map((message, index) => (
                  <Link
                    key={message.id}
                    to={`/chat/${message.id}`}
                    className="block p-4 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)] hover:border-[#6B6B6B] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2D2D2D] to-[#6B6B6B] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                            {message.customer.charAt(0)}
                          </span>
                        </div>
                        {message.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#2D2D2D] rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-white text-xs" style={{ fontWeight: "700" }}>
                              {message.unread}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-white" style={{ fontWeight: "600" }}>
                            {message.customer}
                          </p>
                          <span className="text-white/70 text-xs flex-shrink-0 ml-2">{message.timestamp}</span>
                        </div>
                        <p className="text-white/80 text-sm mb-1 truncate">{message.lastMessage}</p>
                        <p className="text-white text-xs" style={{ fontWeight: "600" }}>Order #{message.orderId}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Reply Templates */}
            <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
              <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                Quick Replies
              </h3>
              <div className="space-y-2">
                <button className="w-full p-4 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)] text-left hover:border-[#6B6B6B] transition-all">
                  <p className="text-white text-sm" style={{ fontWeight: "600" }}>
                    "Your order is ready for pickup!"
                  </p>
                </button>
                <button className="w-full p-4 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)] text-left hover:border-[#6B6B6B] transition-all">
                  <p className="text-white text-sm" style={{ fontWeight: "600" }}>
                    "I've received your measurements"
                  </p>
                </button>
                <button className="w-full p-4 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)] text-left hover:border-[#6B6B6B] transition-all">
                  <p className="text-white text-sm" style={{ fontWeight: "600" }}>
                    "Expected completion: [date]"
                  </p>
                </button>
              </div>
            </div>

            {/* Message Stats */}
            <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
              <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)]">
                  <span className="text-white/80 text-sm">Response Time</span>
                  <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                    2.5h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)]">
                  <span className="text-white/80 text-sm">Messages/Week</span>
                  <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                    47
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#6B6B6B]/35 rounded-2xl border border-[rgba(45,45,45,0.1)]">
                  <span className="text-white/80 text-sm">Satisfaction</span>
                  <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                    98%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Measurements Tab */}
        {activeTab === "measurements" && (
          <div className="bg-[#2D2D2D]/70 rounded-3xl p-0 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] overflow-hidden backdrop-blur-lg">
            <div className="p-6 border-b border-[rgba(45,45,45,0.1)]">
              <h3 className="text-white flex items-center gap-2" style={{ fontSize: "18px", fontWeight: "700" }}>
                <Ruler size={20} />
                Customer Measurements
              </h3>
              <p className="text-white/80 text-sm mt-2">
                View and manage measurements from your assigned orders
              </p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin">
                    <div className="w-8 h-8 border-3 border-[#6B6B6B]/50 border-t-white rounded-full"></div>
                  </div>
                </div>
              ) : (
                <CustomerMeasurements 
                  designerId={currentUser?.uid}
                  onMeasurementsLoad={(count) => console.log(`Loaded ${count} customer measurements`)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
