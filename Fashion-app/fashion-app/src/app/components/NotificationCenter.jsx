import { useEffect, useState } from "react";
import { Bell, X, Trash2, CheckCircle, AlertCircle, Info, MessageSquare, Zap, Ruler } from "lucide-react";
import { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  NOTIFICATION_TYPES 
} from "../services/notificationsService";

export function NotificationCenter({ userId, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        getUserNotifications(userId, { pageLimit: 20 }),
        getUnreadCount(userId)
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
      setLoading(false);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(notifs =>
        notifs.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userId);
      setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifs => notifs.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.ORDER_CONFIRMED:
      case NOTIFICATION_TYPES.BOOKING_CONFIRMED:
        return <CheckCircle size={18} className="text-green-600" />;
      case NOTIFICATION_TYPES.MESSAGE_RECEIVED:
        return <MessageSquare size={18} className="text-blue-600" />;
      case NOTIFICATION_TYPES.ADMIN_ALERT:
        return <AlertCircle size={18} className="text-red-600" />;
      case NOTIFICATION_TYPES.DESIGNER_VERIFIED:
        return <Zap size={18} className="text-yellow-600" />;
      case NOTIFICATION_TYPES.MEASUREMENT_UPLOADED:
        return <Ruler size={18} className="text-purple-600" />;
      default:
        return <Info size={18} className="text-[#E76F51]" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.ADMIN_ALERT:
        return "bg-red-50 border-red-100";
      case NOTIFICATION_TYPES.MESSAGE_RECEIVED:
        return "bg-blue-50 border-blue-100";
      case NOTIFICATION_TYPES.ORDER_CONFIRMED:
      case NOTIFICATION_TYPES.BOOKING_CONFIRMED:
        return "bg-green-50 border-green-100";
      case NOTIFICATION_TYPES.MEASUREMENT_UPLOADED:
        return "bg-purple-50 border-purple-100";
      default:
        return "bg-orange-50 border-orange-100";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-end pt-16">
      <div className="bg-white w-full max-w-md h-full shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-[#E76F51]" />
            <h2 className="text-[#2D2D2D] font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {Math.min(unreadCount, 9)}+
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} className="text-[#2D2D2D]" />
          </button>
        </div>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-5 py-3 bg-[#E76F51]/10 text-[#E76F51] text-sm font-semibold border-b border-gray-100 hover:bg-[#E76F51]/20 transition-all"
          >
            Mark all as read
          </button>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E76F51] rounded-full"></div>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-[#4B5563]">
              <Bell size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-semibold">No notifications</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 transition-all hover:bg-gray-50 ${
                    notification.read
                      ? "border-l-gray-200 bg-white"
                      : "border-l-[#E76F51] bg-[#E76F51]/5"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-[#2D2D2D] font-semibold text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-[#4B5563] text-xs mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-[#E76F51] rounded-full mt-1"></div>
                        )}
                      </div>

                      {/* Time */}
                      <p className="text-[#4B5563] text-xs mt-2">
                        {notification.createdAt instanceof Date
                          ? notification.createdAt.toLocaleString()
                          : new Date(notification.createdAt).toLocaleString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-[#E76F51] hover:font-semibold transition-all"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-xs text-red-600 hover:font-semibold transition-all ml-auto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;
