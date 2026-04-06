import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaSignOutAlt } from "react-icons/fa";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    address: "",
    city: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || currentUser?.email || "",
        phone: userProfile.phone || "",
        role: userProfile.role || "customer",
        address: userProfile.address || "",
        city: userProfile.city || "",
        country: userProfile.country || "",
      });
    } else if (currentUser) {
      // First time user
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || "",
      }));
    }
  }, [userProfile, currentUser]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSave = async () => {
    if (!currentUser) return;

    // Validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("Name and phone are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const result = await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        role: formData.role,
      });

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update profile: " + result.error);
      }
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/landing");
    } catch (err) {
      setError("Failed to logout: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-blue-100 mt-1">
                {formData.role && `${formData.role} Account`}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Profile Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaUser /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.name || "Not provided"}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope /> Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaPhone /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="+233 xx xxx xxxx"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.phone || "Not provided"}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Type
                </label>
                <p className="text-gray-800 text-lg capitalize">
                  {formData.role || "Not specified"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Account type cannot be changed</p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.address || "Not provided"}</p>
                )}
              </div>

              {/* City and Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your city"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.city || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your country"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.country || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    <FaSave /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition"
                  >
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  <FaSignOutAlt /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
