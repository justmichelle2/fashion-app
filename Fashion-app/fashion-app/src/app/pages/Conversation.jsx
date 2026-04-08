import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Image as ImageIcon, Paperclip, MoreVertical } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockDesigners } from "../data/mockData";
import { sendMessage, subscribeToMessages } from "../utils/chatService";
import { uploadImage } from "../utils/storageService";

export default function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [designer, setDesigner] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);

  // Mock designer fallback
  const mockDesigner = mockDesigners.find((d) => d.id === id) || mockDesigners[0];

  const designerPhotos = [
    "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ];

  useEffect(() => {
    if (!currentUser || !userProfile) {
      navigate("/login");
      return;
    }

    // For now, use mock designer - in production, fetch from Firestore
    setDesigner(mockDesigner);
    setConversationId(`${currentUser.uid}_${id}`);

    // Subscribe to real-time messages
    const unsubscribeFn = subscribeToMessages(`${currentUser.uid}_${id}`, (result) => {
      setLoading(false);
      if (result.success) {
        setMessages(result.messages);
      } else {
        setError(result.error);
      }
    });

    setUnsubscribe(() => unsubscribeFn);

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, [id, currentUser, userProfile, navigate]);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!message.trim() || !currentUser || !conversationId) return;

    try {
      setSending(true);
      setError("");

      const result = await sendMessage(
        conversationId,
        currentUser.uid,
        userProfile.name || currentUser.displayName || "Anonymous",
        message.trim(),
        []
      );

      if (result.success) {
        setMessage("");
      } else {
        setError(result.error || "Failed to send message");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      const result = await uploadImage(file, `chat/${conversationId}`);
      if (result.success) {
        const messageResult = await sendMessage(
          conversationId,
          currentUser.uid,
          userProfile.name || currentUser.displayName || "Anonymous",
          "📷 Shared an image",
          [{ type: "image", url: result.url, fileName: result.fileName }]
        );
        if (!messageResult.success) {
          setError(messageResult.error);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAB308] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Back">
              <ArrowLeft size={24} className="text-[#111827]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={designer?.profilePicture || designerPhotos[parseInt(id || "0", 10) % designerPhotos.length]}
                  alt={designer?.name || "Designer"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-[#111827] font-semibold">{designer?.name || "Designer"}</h2>
                <p className="text-[#10B981] text-xs">Online</p>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="More options">
            <MoreVertical size={24} className="text-[#111827]" />
          </button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-2 bg-red-100 border-b border-red-300 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === currentUser?.uid ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.senderId === currentUser?.uid
                    ? "bg-[#EAB308] text-white rounded-tr-sm"
                    : "bg-white border border-gray-200 text-[#111827] rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.attachments.map((attachment, idx) => (
                      <a
                        key={idx}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs underline text-opacity-80"
                      >
                        {attachment.fileName}
                      </a>
                    ))}
                  </div>
                )}
                <p className={`text-xs mt-1 ${msg.senderId === currentUser?.uid ? "text-white/80" : "text-[#4B5563]"}`}>
                  {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString() : "Just now"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <label className="p-2 text-gray-400 hover:text-[#EAB308] transition-colors cursor-pointer" aria-label="Add image">
            <ImageIcon size={24} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={sending}
            />
          </label>
          <button type="button" className="p-2 text-gray-400 hover:text-[#EAB308] transition-colors" aria-label="Add attachment">
            <Paperclip size={24} />
          </button>

          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              disabled={sending}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-transparent resize-none disabled:bg-gray-100"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="p-3 bg-[#EAB308] text-white rounded-xl hover:bg-[#CA9A04] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
