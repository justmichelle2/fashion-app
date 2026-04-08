import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, AlertCircle } from "lucide-react";
import { 
  getNotificationPreferences, 
  updateNotificationPreferences 
} from "../services/notificationsService";

export function NotificationSettings({ userId }) {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    try {
      const prefs = await getNotificationPreferences(userId);
      setPreferences(prefs);
      setLoading(false);
    } catch (err) {
      setError("Failed to load preferences");
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await updateNotificationPreferences(userId, preferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E76F51] rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return <div className="text-red-600">Failed to load preferences</div>;
  }

  const ToggleSwitch = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all">
      <span className="text-[#2D2D2D] font-semibold">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-[#E76F51]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={20} className="text-[#E76F51]" />
        <h3 className="text-[#2D2D2D] font-semibold text-lg">Notification Settings</h3>
      </div>

      {/* Notification Channels */}
      <div>
        <h4 className="text-[#2D2D2D] font-semibold mb-3 text-base">Notification Channels</h4>
        <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
          <ToggleSwitch
            label="In-App Notifications"
            value={preferences.inApp}
            onChange={() => handleToggle("inApp")}
          />
          <ToggleSwitch
            label="Email Notifications"
            value={preferences.email}
            onChange={() => handleToggle("email")}
          />
          <ToggleSwitch
            label="Push Notifications"
            value={preferences.push}
            onChange={() => handleToggle("push")}
          />
        </div>
        <p className="text-[#4B5563] text-xs mt-2">
          Choose which channels you'd like to receive notifications on
        </p>
      </div>

      {/* Notification Types */}
      <div>
        <h4 className="text-[#2D2D2D] font-semibold mb-3 text-base">Notification Types</h4>
        <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
          <ToggleSwitch
            label="Order Updates"
            value={preferences.orderUpdates}
            onChange={() => handleToggle("orderUpdates")}
          />
          <ToggleSwitch
            label="Messages"
            value={preferences.messages}
            onChange={() => handleToggle("messages")}
          />
          <ToggleSwitch
            label="Reviews & Ratings"
            value={preferences.reviews}
            onChange={() => handleToggle("reviews")}
          />
          <ToggleSwitch
            label="Promotions & Offers"
            value={preferences.promotions}
            onChange={() => handleToggle("promotions")}
          />
        </div>
        <p className="text-[#4B5563] text-xs mt-2">
          Select which types of notifications you'd like to receive
        </p>
      </div>

      {/* Sound & Vibration */}
      <div>
        <h4 className="text-[#2D2D2D] font-semibold mb-3 text-base">Notification Alerts</h4>
        <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
          <ToggleSwitch
            label="Sound"
            value={preferences.sound}
            onChange={() => handleToggle("sound")}
          />
          <ToggleSwitch
            label="Vibration"
            value={preferences.vibration}
            onChange={() => handleToggle("vibration")}
          />
        </div>
        <p className="text-[#4B5563] text-xs mt-2">
          Enable sound and vibration alerts for new notifications
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 rounded-xl">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-3 p-4 bg-green-50 rounded-xl">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm">Settings saved successfully!</p>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </>
        ) : (
          <>
            <Save size={18} />
            Save Preferences
          </>
        )}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-700 text-xs leading-relaxed">
          <strong>Note:</strong> Your notification preferences apply across all devices. You can update these settings anytime.
        </p>
      </div>
    </div>
  );
}

export default NotificationSettings;
