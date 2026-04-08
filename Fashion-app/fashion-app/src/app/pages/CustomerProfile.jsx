import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Edit2, Save, X, LogOut, Heart, Upload } from "lucide-react";
import { auth } from "../firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { getCustomerProfile, updateCustomerProfile, getFavoriteDesigners } from "../utils/customerUtils";
import { handleLogout } from "../utils/authUtils";
import { uploadProfilePicture } from "../utils/storageService";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    loadProfile();
    loadFavorites();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const result = await getCustomerProfile();
      if (result.success) {
        setProfile(result.profile);
        setFormData({
          displayName: result.profile.name || "",
          email: result.profile.email || "",
          phone: result.profile.phone || "",
          address: result.profile.address || "",
          city: result.profile.city || "",
          country: result.profile.country || "",
          profilePicture: result.profile.profilePicture || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const result = await getFavoriteDesigners();
      if (result.success) {
        setFavorites(result.designers || []);
      }
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) {
      setError("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const result = await uploadProfilePicture(currentUser.uid, file);

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          profilePicture: result.url,
        }));
        setSuccess("Profile picture updated!");
        
        // Auto-save profile picture
        await updateCustomerProfile({
          ...formData,
          profilePicture: result.url,
        });
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateCustomerProfile(formData);
      if (result.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        loadProfile();
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-20">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#E76F51] to-[#F4A261] px-6 py-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-white/80 mt-1">Customer Account</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white text-[#E76F51] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <Edit2 size={18} /> Edit
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                ✓ {success}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex items-center justify-center text-white text-4xl font-bold">
                    {formData.profilePicture ? (
                      <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      profile?.name?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={20} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D] mb-2">
                  <User size={18} /> Full Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D] mb-2">
                  <Mail size={18} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D] mb-2">
                  <Phone size={18} /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+233..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] disabled:bg-gray-100"
                />
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D] mb-2">
                  <MapPin size={18} /> Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] disabled:bg-gray-100"
                />
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#2D2D2D] mb-2 block">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#2D2D2D] mb-2 block">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#E76F51] text-white py-3 rounded-lg font-semibold hover:bg-[#D55B3A] transition disabled:opacity-50"
                  >
                    <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-[#2D2D2D] py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    <X size={18} /> Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Favorite Designers */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 p-6">
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
              <Heart size={24} className="text-[#E76F51] fill-[#E76F51]" /> Favorite Designers ({favorites.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {favorites.map((designer) => (
                <div
                  key={designer.portfolioId}
                  className="p-4 border border-gray-100 rounded-lg hover:border-[#E76F51]/30 transition cursor-pointer"
                  onClick={() => navigate(`/designer/${designer.designerId}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-[#2D2D2D]">{designer.title}</h3>
                      <p className="text-sm text-gray-600">{designer.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#E76F51] font-semibold">⭐ {designer.rating || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#2D2D2D] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/measurements")}
              className="w-full p-4 text-left border border-gray-100 rounded-lg hover:border-[#E76F51]/30 hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-[#2D2D2D]">Upload Measurements</p>
              <p className="text-sm text-gray-600">Store your body measurements</p>
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="w-full p-4 text-left border border-gray-100 rounded-lg hover:border-[#E76F51]/30 hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-[#2D2D2D]">View Orders</p>
              <p className="text-sm text-gray-600">Track your design orders</p>
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="w-full p-4 text-left border border-gray-100 rounded-lg hover:border-[#E76F51]/30 hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-[#2D2D2D]">Messages</p>
              <p className="text-sm text-gray-600">Chat with designers</p>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 p-4 rounded-lg font-semibold hover:bg-red-100 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

    </div>
  );
}
