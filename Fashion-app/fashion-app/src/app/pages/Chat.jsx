import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageSquare, Clock, User } from "lucide-react";
import { mockMessages } from "../data/mockData";

export default function Chat() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockMessages.filter((chat) =>
    chat.designerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm p-6 space-y-4">
        <div>
          <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display']">Messages</h1>
          <p className="text-[#6B6B6B] text-sm font-['Raleway']">Stay connected with designers</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-full p-3 pl-12 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="p-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-[#E76F51]/30 mx-auto mb-4" />
            <p className="text-[#6B6B6B] font-['Raleway']">No conversations yet</p>
          </div>
        ) : (
          filtered.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-[#E76F51]/10 hover:border-[#E76F51]/30 text-left"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex-shrink-0 flex items-center justify-center text-xl">
                  💬
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[#2D2D2D] font-semibold font-['Raleway'] truncate">{chat.designerName}</h3>
                    {chat.unread > 0 && (
                      <span className="bg-[#E76F51] text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>

                  <p className="text-[#6B6B6B] text-sm font-['Raleway'] truncate mb-2">{chat.lastMessage}</p>

                  <div className="flex items-center gap-1 text-[#6B6B6B] text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{chat.timestamp}</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
