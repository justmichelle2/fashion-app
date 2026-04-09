import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Search, MessageCircle } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function DesignerMessages() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    try {
      const conversationsRef = collection(db, "conversations");
      const conversationsQuery = query(
        conversationsRef,
        where("participants", "array-contains", currentUser.uid)
      );

      // Use real-time listener instead of one-time fetch
      const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
        const convs = snapshot.docs.map(doc => {
          const data = doc.data();
          const otherParticipant = data.participants?.find(p => p !== currentUser.uid);
          return {
            id: doc.id,
            customer: data.participantNames?.[otherParticipant] || "Unknown",
            lastMessage: data.lastMessage || "No messages yet",
            time: data.updatedAt?.toDate?.()?.toLocaleTimeString() || "just now",
            unread: (data.unreadCount?.[currentUser.uid] || 0) > 0,
            unreadCount: data.unreadCount?.[currentUser.uid] || 0,
            avatar: (data.participantNames?.[otherParticipant] || "?").charAt(0).toUpperCase(),
          };
        });

        // Sort by most recent first
        convs.sort((a, b) => {
          const timeA = a.time === "just now" ? 0 : new Date(a.time);
          const timeB = b.time === "just now" ? 0 : new Date(b.time);
          return timeB - timeA;
        });

        setConversations(convs);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up listener:", error);
      setLoading(false);
    }
  }, [currentUser]);

  const filteredConversations = conversations.filter((conv) =>
    conv.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-hidden">
      <div className="max-w-2xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft size={20} className="text-[#2D2D2D]" />
            </button>
            <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
              Messages
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D3436]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-[#2D2D2D] placeholder-[#2D3436]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin">
                <div className="w-6 h-6 border-3 border-gray-200 border-t-[#E63946] rounded-full"></div>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-[#2D3436]">No conversations yet</p>
              <p className="text-[#9CA3AF] text-sm mt-1">Messages from customers will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <Link
                  key={conv.id}
                  to={`/designer/chat/${conv.id}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#E63946]/30 hover:bg-[#FFF9F5] transition-all"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#E63946] to-[#D4AF37] rounded-full flex items-center justify-center">
                      <span className="text-white font-['Playfair_Display'] font-bold text-lg">{conv.avatar}</span>
                    </div>
                    {conv.unread && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#E63946] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{conv.unreadCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm ${conv.unread ? "font-bold text-[#2D2D2D]" : "text-[#2D2D2D]"}`}>
                        {conv.customer}
                      </p>
                      <span className="text-xs text-[#2D3436] flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread ? "text-[#2D3436] font-semibold" : "text-[#2D3436]"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  <ChevronRight size={20} className="text-[#2D3436] flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
