import { useState, useEffect } from "react";
import { Clock, Save, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { setDesignerSchedule, getDesignerSchedule, addDayOff, removeDayOff, setAvailabilityStatus } from "../services/availabilityService";

export function ScheduleManager({ designerId }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("available");
  const [daysOffInput, setDaysOffInput] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await getDesignerSchedule(designerId);
        setSchedule(data);
        setSelectedStatus(data.status || "available");
        setLoading(false);
      } catch (err) {
        setError("Failed to load schedule");
        setLoading(false);
      }
    };

    loadSchedule();
  }, [designerId]);

  const handleWorkingHourChange = (day, field, value) => {
    if (!schedule) return;

    setSchedule({
      ...schedule,
      workingHours: {
        ...schedule.workingHours,
        [day]: {
          ...schedule.workingHours[day],
          [field]: value
        }
      }
    });
  };

  const handleToggleDay = (day) => {
    if (!schedule) return;

    setSchedule({
      ...schedule,
      workingHours: {
        ...schedule.workingHours,
        [day]: {
          ...schedule.workingHours[day],
          enabled: !schedule.workingHours[day].enabled
        }
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await setDesignerSchedule(designerId, schedule);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleAddDayOff = async () => {
    if (!daysOffInput) {
      setError("Please select a date");
      return;
    }

    try {
      await addDayOff(designerId, new Date(daysOffInput), "Day off");
      setSchedule({
        ...schedule,
        daysOff: [...(schedule.daysOff || []), { date: daysOffInput, reason: "Day off" }]
      });
      setDaysOffInput("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to add day off");
    }
  };

  const handleRemoveDayOff = async (dayOffDate) => {
    try {
      await removeDayOff(designerId, new Date(dayOffDate));
      setSchedule({
        ...schedule,
        daysOff: schedule.daysOff.filter(d => d.date !== dayOffDate)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to remove day off");
    }
  };

  const handleStatusChange = async (status) => {
    setSelectedStatus(status);
    try {
      await setAvailabilityStatus(designerId, status);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to update status");
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

  if (!schedule) {
    return <div className="text-red-600">Failed to load schedule</div>;
  }

  return (
    <div className="space-y-6">
      {/* Status Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-[#2D2D2D] font-semibold text-lg mb-4">Availability Status</h3>
        <div className="flex gap-3">
          {[
            { id: "available", label: "Available", color: "bg-green-100 border-green-300" },
            { id: "busy", label: "Busy", color: "bg-yellow-100 border-yellow-300" },
            { id: "on-break", label: "On Break", color: "bg-red-100 border-red-300" }
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => handleStatusChange(status.id)}
              className={`px-4 py-2 rounded-xl border-2 font-semibold transition-all ${
                selectedStatus === status.id
                  ? status.color
                  : "bg-gray-100 border-gray-200 text-[#4B5563]"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Working Hours Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-[#2D2D2D] font-semibold text-lg mb-4 flex items-center gap-2">
          <Clock size={20} />
          Working Hours
        </h3>

        <div className="space-y-4">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
              <label className="flex items-center gap-2 min-w-[120px]">
                <input
                  type="checkbox"
                  checked={schedule.workingHours[day]?.enabled || false}
                  onChange={() => handleToggleDay(day)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-[#2D2D2D] font-semibold">{day}</span>
              </label>

              {schedule.workingHours[day]?.enabled && (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={schedule.workingHours[day]?.start || "09:00"}
                    onChange={(e) => handleWorkingHourChange(day, "start", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <span className="text-[#4B5563]">to</span>
                  <input
                    type="time"
                    value={schedule.workingHours[day]?.end || "18:00"}
                    onChange={(e) => handleWorkingHourChange(day, "end", e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Days Off Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-[#2D2D2D] font-semibold text-lg mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Days Off
        </h3>

        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={daysOffInput}
            onChange={(e) => setDaysOffInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
          />
          <button
            onClick={handleAddDayOff}
            className="px-4 py-2 bg-[#E76F51] text-white rounded-lg hover:bg-[#D35F41] transition-all font-semibold"
          >
            Add
          </button>
        </div>

        {schedule.daysOff && schedule.daysOff.length > 0 ? (
          <div className="space-y-2">
            {schedule.daysOff.map((dayOff, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-[#2D2D2D]">
                  {new Date(dayOff.date || dayOff).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleRemoveDayOff(dayOff.date || dayOff)}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#4B5563] text-center py-4">No days off scheduled</p>
        )}
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
          <p className="text-green-700 text-sm">Changes saved successfully!</p>
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
            Save Schedule
          </>
        )}
      </button>
    </div>
  );
}

export default ScheduleManager;
