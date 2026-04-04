import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Phone, Info } from "lucide-react";
import { mockMessages } from "../data/mockData";
import { useState } from "react";

export default function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chat = mockMessages.find((c) => c.id === id);
  const [message, setMessage] = useState("");

  if (!chat)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Conversation not found</p>
      </div>
    );

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E76F51]/10 p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-[#F5E6D3] flex items-center justify-center transition">
          <ArrowLeft className="w-5 h-5 text-[#2D2D2D]" />
        </button>

        <div className="flex-1 ml-4">
          <h2 className="text-[#2D2D2D] font-semibold font-['Playfair_Display']">{chat.designerName}</h2>
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Active now</p>
        </div>

        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full hover:bg-[#F5E6D3] flex items-center justify-center transition">
            <Phone className="w-5 h-5 text-[#E76F51]" />
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-[#F5E6D3] flex items-center justify-center transition">
            <Info className="w-5 h-5 text-[#E76F51]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="bg-[#F5E6D3] text-[#2D2D2D] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs font-['Raleway']">
            Hi! I'm interested in a custom wedding dress. Can you help?
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-[#E76F51] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs font-['Raleway']">
            Absolutely! I'd love to help. Let me know your preferences.
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-[#F5E6D3] text-[#2D2D2D] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs font-['Raleway']">
            Traditional Ghanaian style, but with modern touches
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-[#E76F51]/10 p-4 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-full px-4 py-3 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none"
          />

          <button
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex items-center justify-center text-white hover:shadow-lg transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
