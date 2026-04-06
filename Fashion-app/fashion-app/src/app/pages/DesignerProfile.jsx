import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaStar } from "react-icons/fa";

export default function DesignerProfile() {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "designer",
    address: "",
    city: "",
    country: "",
    bio: "",
    specialty: "",
    hourlyRate: "",
    experience: "",
    portfolio: "",
    rating: 0,
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
        role: userProfile.role || "designer",
        address: userProfile.address || "",
        city: userProfile.city || "",
        country: userProfile.country || "",
        bio: userProfile.bio || "",
        specialty: userProfile.specialty || "",
        hourlyRate: userProfile.hourlyRate || "",
        experience: userProfile.experience || "",
        portfolio: userProfile.portfolio || "",
        rating: userProfile.rating || 0,
      });
    } else if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || "",
      }));
    }
  }, [userProfile, currentUser]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/designer-login");
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
        bio: formData.bio,
        specialty: formData.specialty,
        hourlyRate: formData.hourlyRate,
        experience: formData.experience,
        portfolio: formData.portfolio,
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
      navigate("/designer-login");
    } catch (err) {
      setError("Failed to logout: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Designer Profile</h1>
              <p className="text-purple-100 mt-1 flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                {formData.rating.toFixed(1)} rating
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
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

            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
              <div className="space-y-4">
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="+233 xx xxx xxxx"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg">{formData.phone || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>
              <div className="space-y-4">
                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.address || "Not provided"}</p>
                  )}
                </div>

                {/* City and Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                        placeholder="Your city"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.city || "Not provided"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                        placeholder="Your country"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.country || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Information</h2>
              <div className="space-y-4">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="Tell us about yourself and your design style..."
                    />
                  ) : (
                    <p className="text-gray-800">{formData.bio || "Not provided"}</p>
                  )}
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialty</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Traditional wear, Modern fashion, etc."
                    />
                  ) : (
                    <p className="text-gray-800">{formData.specialty || "Not provided"}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="0"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.experience ? `${formData.experience} years` : "Not provided"}</p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (GHS)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="0.00"
                    />
                  ) : (
                    <p className="text-gray-800">GHS {parseFloat(formData.hourlyRate || 0).toFixed(2)}</p>
                  )}
                </div>

                {/* Portfolio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="https://your-portfolio.com"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {formData.portfolio ? (
                        <a href={formData.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          {formData.portfolio}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
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
