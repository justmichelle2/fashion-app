import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockMessages } from "../data/mockData";

export default function Chat() {
  const designerPhotos = [
    "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1726142916875-814508f61e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ];

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
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
          />
        </div>
      </div>

      <div className="px-6 py-4 space-y-2">
        {mockMessages.map((message, index) => (
          <Link
            key={message.id}
            to={`/chat/${message.userId}`}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#E76F51] hover:shadow-md transition-all"
          >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={designerPhotos[index % designerPhotos.length]}
                  alt={message.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#10B981] border-2 border-white rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-[#111827] truncate font-semibold">{message.userName}</h3>
                <span className="text-[#4B5563] text-xs flex-shrink-0">{message.timestamp}</span>
              </div>
              <p className="text-[#4B5563] text-sm truncate">{message.lastMessage}</p>
            </div>

            {message.unread > 0 && (
              <div className="flex-shrink-0 w-6 h-6 bg-[#EAB308] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{message.unread}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
