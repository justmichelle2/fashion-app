import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Send, Image as ImageIcon, Paperclip, MoreVertical } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockDesigners } from "../data/mockData";

export function Conversation() {
  const { id } = useParams();
  const designer = mockDesigners.find(d => d.id === id) || mockDesigners[0];
  const [message, setMessage] = useState("");

  const designerPhotos = [
    "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI2MDU2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwbWFuJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNjI0MTk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const messages = [
    { id: 1, sender: "designer", text: "Hello! Thank you for choosing Emma Bee Clothing. How can I help you today?", time: "10:30 AM" },
    { id: 2, sender: "user", text: "Hi! I'd like to order a custom Kente dress for a wedding.", time: "10:32 AM" },
    { id: 3, sender: "designer", text: "That's wonderful! I'd be happy to create that for you. Do you have any specific design preferences?", time: "10:33 AM" },
    { id: 4, sender: "user", text: "Yes, I'm thinking of a fitted bodice with a flared skirt. Traditional Kente patterns.", time: "10:35 AM" },
    { id: 5, sender: "designer", text: "Perfect! I have some beautiful Kente fabrics in stock. When do you need it by?", time: "10:36 AM" },
    { id: 6, sender: "designer", text: "Your dress will be ready by Friday!", time: "2h ago" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle send message
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/chat" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={24} className="text-[#111827]" />
            </Link>
            
            {/* Designer Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={designerPhotos[parseInt(id || "0") % 2]}
                  alt={designer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-[#111827]" style={{ fontWeight: "600" }}>
                  {designer.name}
                </h2>
                <p className="text-[#10B981] text-xs">Online</p>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={24} className="text-[#111827]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-[#EAB308] text-white"
                  : "bg-white border border-gray-200 text-[#111827]"
              } rounded-2xl px-4 py-3`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "user" ? "text-white/80" : "text-[#4B5563]"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          {/* Attachment Buttons */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-[#EAB308] transition-colors"
          >
            <ImageIcon size={24} />
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-[#EAB308] transition-colors"
          >
            <Paperclip size={24} />
          </button>

          {/* Input Field */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-transparent resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-[#EAB308] text-white rounded-xl hover:bg-[#CA9A04] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
