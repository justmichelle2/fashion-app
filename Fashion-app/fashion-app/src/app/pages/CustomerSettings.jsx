import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Lock, User, CreditCard, Trash2, LogOut, ChevronRight, Shield, Plus, Trash } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { handleLogout } from "../utils/authUtils";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  deleteUserAccount,
} from "../utils/settingsService";

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Notification preferences
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    messages: true,
    promotions: false,
    weeklyReport: true,
  });

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [notifResult, paymentResult] = await Promise.all([
        getNotificationPreferences(),
        getPaymentMethods(),
      ]);

      if (notifResult.success) {
        setNotifications(notifResult.preferences);
      }
      if (paymentResult.success) {
        setPaymentMethods(paymentResult.paymentMethods);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateNotificationPreferences(updated);
      if (result.success) {
        setSuccess("Notification preferences updated!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error);
        setNotifications(notifications); // Revert on error
      }
    } catch (err) {
      setError(err.message);
      setNotifications(notifications);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    if (!newPayment.cardNumber || !newPayment.cardHolder || !newPayment.expiryDate) {
      setError("Please fill in all payment details");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = await addPaymentMethod({
        type: "card",
        last4: newPayment.cardNumber.slice(-4),
        cardHolder: newPayment.cardHolder,
        expiryDate: newPayment.expiryDate,
      });

      if (result.success) {
        setPaymentMethods([...paymentMethods, result.paymentMethod]);
        setNewPayment({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
        setShowAddPayment(false);
        setSuccess("Payment method added!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePaymentMethod = async (methodId) => {
    if (!window.confirm("Are you sure you want to remove this payment method?")) return;

    try {
      const result = await removePaymentMethod(methodId);
      if (result.success) {
        setPaymentMethods(paymentMethods.filter(m => m.id !== methodId));
        setSuccess("Payment method removed!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/landing");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    setError("");

    try {
      const result = await deleteUserAccount();
      if (result.success) {
        navigate("/landing");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-20">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-[#2D2D2D]">Settings</h1>
          <p className="text-[#4B5563] text-sm mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            ✓ {success}
          </div>
        )}
        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
              <User size={20} />
              Account Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-[#4B5563] text-sm mb-1">Name</p>
              <p className="text-[#2D2D2D] font-medium">{userProfile?.name || currentUser?.displayName || "Not set"}</p>
            </div>
            <div>
              <p className="text-[#4B5563] text-sm mb-1">Email</p>
              <p className="text-[#2D2D2D] font-medium">{userProfile?.email || currentUser?.email || "Not set"}</p>
            </div>
            <button
              onClick={() => navigate("/customer/profile")}
              className="w-full mt-4 py-3 bg-[#E63946]/10 text-[#E63946] rounded-xl hover:bg-[#E63946]/20 transition-all font-semibold flex items-center justify-between"
            >
              <span>Edit Profile</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2D2D2D] font-medium">Order Updates</p>
                <p className="text-[#4B5563] text-sm">Get notified about order progress</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={() => handleNotificationChange("orderUpdates")}
                disabled={saving}
                className="w-5 h-5 rounded cursor-pointer accent-[#E63946]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2D2D2D] font-medium">Messages</p>
                <p className="text-[#4B5563] text-sm">Receive designer messages</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.messages}
                onChange={() => handleNotificationChange("messages")}
                disabled={saving}
                className="w-5 h-5 rounded cursor-pointer accent-[#E63946]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2D2D2D] font-medium">Promotions</p>
                <p className="text-[#4B5563] text-sm">Special offers and updates</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={() => handleNotificationChange("promotions")}
                disabled={saving}
                className="w-5 h-5 rounded cursor-pointer accent-[#E63946]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2D2D2D] font-medium">Weekly Report</p>
                <p className="text-[#4B5563] text-sm">Weekly summary of your activity</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyReport}
                onChange={() => handleNotificationChange("weeklyReport")}
                disabled={saving}
                className="w-5 h-5 rounded cursor-pointer accent-[#E63946]"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
              <CreditCard size={20} />
              Payment Methods
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {paymentMethods.length === 0 ? (
              <p className="text-[#4B5563] text-sm">No payment methods saved</p>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[#2D2D2D] font-medium">{method.cardHolder}</p>
                      <p className="text-[#4B5563] text-sm">•••• {method.last4}</p>
                    </div>
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddPayment ? (
              <form onSubmit={handleAddPaymentMethod} className="space-y-3 pt-4 border-t">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={newPayment.cardNumber}
                  onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                />
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={newPayment.cardHolder}
                  onChange={(e) => setNewPayment({ ...newPayment, cardHolder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={newPayment.expiryDate}
                    onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={newPayment.cvv}
                    onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#D55B3A] disabled:opacity-50"
                  >
                    {saving ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddPayment(true)}
                className="w-full py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37]/20 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Payment Method
              </button>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
          <div className="p-6 border-b border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
              <Shield size={20} />
              Danger Zone
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={handleLogoutClick}
              className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left font-medium text-[#2D2D2D] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <LogOut size={18} /> Logout
              </span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all text-left font-medium text-red-700 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Trash2 size={18} /> Delete Account
              </span>
              <ChevronRight size={18} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">Delete Account?</h3>
            <p className="text-[#4B5563] mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={saving}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
