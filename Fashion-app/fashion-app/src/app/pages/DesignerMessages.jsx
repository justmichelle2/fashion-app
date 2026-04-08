import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DesignerMessages() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = [
    {
      id: "1",
      customer: "Akosua Owusu",
      lastMessage: "When will my dress be ready?",
      time: "1 hour ago",
      unread: true,
      unreadCount: 2,
      avatar: "A",
    },
    {
      id: "2",
      customer: "Ama Boateng",
      lastMessage: "Can you add some beads to the dress?",
      time: "3 hours ago",
      unread: true,
      unreadCount: 1,
      avatar: "A",
    },
    {
      id: "3",
      customer: "Efua Mensah",
      lastMessage: "Thank you for the update!",
      time: "1 day ago",
      unread: false,
      unreadCount: 0,
      avatar: "E",
    },
    {
      id: "4",
      customer: "Kofi Asante",
      lastMessage: "Your work is amazing!",
      time: "2 days ago",
      unread: false,
      unreadCount: 0,
      avatar: "K",
    },
    {
      id: "5",
      customer: "Yaw Boateng",
      lastMessage: "I'll pick up tomorrow",
      time: "1 week ago",
      unread: false,
      unreadCount: 0,
      avatar: "Y",
    },
  ];

  const filteredConversations = conversations.filter((conv) =>
    conv.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 px-6 py-4">
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
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-[#2D2D2D] placeholder-[#4B5563]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#4B5563]">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <Link
                  key={conv.id}
                  to={`/chat/${conv.id}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#E76F51]/30 hover:bg-[#FFF9F5] transition-all"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-full flex items-center justify-center">
                      <span className="text-white font-['Playfair_Display'] font-bold text-lg">{conv.avatar}</span>
                    </div>
                    {conv.unread && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F97316] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{conv.unreadCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm ${conv.unread ? "font-bold text-[#2D2D2D]" : "text-[#2D2D2D]"}`}>
                        {conv.customer}
                      </p>
                      <span className="text-xs text-[#4B5563] flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread ? "text-[#4B5563] font-semibold" : "text-[#4B5563]"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  <ChevronRight size={20} className="text-[#4B5563] flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
