import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Lock, User, CreditCard, Trash2, LogOut, ChevronRight, Shield, DollarSign, Calendar } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { handleLogout } from "../utils/authUtils";

export default function DesignerSettings() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/landing");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion
    console.log("Delete account clicked");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-[#2D2D2D]">Settings</h1>
          <p className="text-[#2D3436] text-sm mt-1">Manage your studio and preferences</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Business Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
              <User size={20} />
              Business Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-[#2D3436] text-sm mb-1">Business Name</p>
              <p className="text-[#2D2D2D] font-medium">{userProfile?.businessName || "Not set"}</p>
            </div>
            <div>
              <p className="text-[#2D3436] text-sm mb-1">Email</p>
              <p className="text-[#2D2D2D] font-medium">{userProfile?.email || currentUser?.email || "Not set"}</p>
            </div>
            <div>
              <p className="text-[#2D3436] text-sm mb-1">Location</p>
              <p className="text-[#2D2D2D] font-medium">{userProfile?.location || "Not set"}</p>
            </div>
            <button
              onClick={() => navigate("/designer/profile")}
              className="w-full mt-4 py-3 bg-[#E63946]/10 text-[#E63946] rounded-xl hover:bg-[#E63946]/20 transition-all font-semibold flex items-center justify-between"
            >
              <span>Edit Profile</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Pricing & Services */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
              <DollarSign size={20} />
              Pricing & Services
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-[#2D3436] text-sm mb-1">Base Rate (GHS/hour)</p>
              <p className="text-[#2D2D2D] font-medium">{userProfile?.baseRate || "Not set"}</p>
            </div>
            <div>
              <p className="text-[#2D3436] text-sm mb-1">Services Offered</p>
              <p className="text-[#2D2D2D] font-medium">{userProfile?.services || "Not set"}</p>
            </div>
            <button className="w-full mt-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37]/20 transition-all font-semibold">
              Manage Services & Pricing
            </button>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
              <Calendar size={20} />
              Availability
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left font-medium text-[#2D2D2D] flex items-center justify-between">
              <span>Set Working Hours</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left font-medium text-[#2D2D2D] flex items-center justify-between">
              <span>Manage Days Off</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left font-medium text-[#2D2D2D] flex items-center justify-between">
              <span>Lead Time Settings</span>
              <ChevronRight size={18} className="text-gray-400" />
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
                <p className="text-[#2D2D2D] font-medium">New Orders</p>
                <p className="text-[#2D3436] text-sm">Get notified about new bookings</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer accent-[#E63946]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2D2D2D] font-medium">Client Messages</p>
                <p className="text-[#2D3436] text-sm">Receive customer inquiries</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer accent-[#E63946]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2D2D2D] font-medium">Payment Updates</p>
                <p className="text-[#2D3436] text-sm">Receive payment notifications</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer accent-[#E63946]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2D2D2D] font-medium">Reviews & Ratings</p>
                <p className="text-[#2D3436] text-sm">New customer reviews</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer accent-[#E63946]" />
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
            <p className="text-[#2D3436] text-sm">This is where clients will pay you. Make sure your payment details are up to date.</p>
            <button className="w-full py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37]/20 transition-all font-semibold">
              + Add Payment Account
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
              <Lock size={20} />
              Privacy & Security
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left font-medium text-[#2D2D2D] flex items-center justify-between">
              <span>Change Password</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left font-medium text-[#2D2D2D] flex items-center justify-between">
              <span>Two-Factor Authentication</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left font-medium text-[#2D2D2D] flex items-center justify-between">
              <span>Active Sessions</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
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
              <div className="flex items-center gap-2">
                <LogOut size={18} />
                <span>Logout</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all text-left font-medium text-red-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Trash2 size={18} />
                <span>Delete Account</span>
              </div>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Delete Account?</h3>
            <p className="text-[#2D3436] mb-6">
              This action cannot be undone. All your studio data, orders, portfolio, and profile information will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-[#2D2D2D] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-white transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
