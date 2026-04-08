import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getUserConversations, searchConversations } from "../utils/chatService";
import { mockMessages } from "../data/mockData";

export default function Chat() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const designerPhotos = [
    "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1726142916875-814508f61e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ];

  useEffect(() => {
    if (!currentUser) return;
    loadConversations();
  }, [currentUser]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await getUserConversations(currentUser.uid);
      
      if (result.success) {
        setConversations(result.conversations || []);
      } else {
        setError(result.error || "Failed to load conversations");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      loadConversations();
      return;
    }

    try {
      const result = await searchConversations(currentUser.uid, term);
      if (result.success) {
        setConversations(result.conversations || []);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getOtherParticipant = (conversation) => {
    const participants = Object.values(conversation.participants || {});
    return participants.find((p) => p.id !== currentUser?.uid) || participants[0];
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/home" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[#111827]" />
          </Link>
          <h1 className="text-[#111827] text-[24px] font-bold">Messages</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="px-6 py-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E76F51] mx-auto mb-3"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No conversations yet. Start a new chat!</p>
        </div>
      ) : (
        <div className="px-6 py-4 space-y-2">
          {conversations.map((conversation, index) => {
            const otherUser = getOtherParticipant(conversation);
            return (
              <Link
                key={conversation.id}
                to={`/chat/${otherUser?.id}`}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#E76F51] hover:shadow-md transition-all"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                    <ImageWithFallback
                      src={designerPhotos[index % designerPhotos.length]}
                      alt={otherUser?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#10B981] border-2 border-white rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-[#111827] truncate font-semibold">{otherUser?.name || "Unknown"}</h3>
                    <span className="text-[#4B5563] text-xs flex-shrink-0">
                      {conversation.lastMessageTime?.toDate
                        ? new Date(conversation.lastMessageTime.toDate()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "now"}
                    </span>
                  </div>
                  <p className="text-[#4B5563] text-sm truncate">{conversation.lastMessage || "No messages yet"}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
