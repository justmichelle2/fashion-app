import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle } from "lucide-react";
import { getAvailableSlots, bookSlot } from "../services/availabilityService";

export function AvailabilityCalendar({ designerId, customerId, orderId, onSlotBooked }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Load available slots when date is selected
  useEffect(() => {
    if (!selectedDate) return;

    const loadSlots = async () => {
      setLoading(true);
      setError("");
      try {
        const slots = await getAvailableSlots(designerId, selectedDate);
        if (slots.length === 0) {
          setError("No available slots on this date");
        }
        setAvailableSlots(slots);
      } catch (err) {
        setError(err.message || "Error loading available slots");
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [selectedDate, designerId]);

  // Handle slot booking
  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    setBookingLoading(true);
    setError("");

    try {
      await bookSlot(designerId, customerId, selectedSlot.start, selectedSlot.end - selectedSlot.start, orderId);
      setSuccess(true);
      setTimeout(() => {
        onSlotBooked?.(selectedSlot);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to book slot");
    } finally {
      setBookingLoading(false);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircle size={40} className="text-green-600 mx-auto mb-3" />
        <h3 className="text-green-700 font-semibold mb-2">Slot Booked!</h3>
        <p className="text-green-600 text-sm">
          Your consultation has been scheduled for{" "}
          <strong>{selectedSlot?.start.toLocaleString()}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 border border-gray-100">
      {/* Calendar Section */}
      <div>
        <h3 className="text-[#2D2D2D] font-semibold text-lg mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Select a Date
        </h3>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ChevronLeft size={20} className="text-[#2D2D2D]" />
          </button>
          <span className="text-[#2D2D2D] font-semibold">{monthName}</span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ChevronRight size={20} className="text-[#2D2D2D]" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-[#4B5563] text-sm font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, idx) => (
            <button
              key={idx}
              onClick={() => !isDateDisabled(date) && setSelectedDate(date)}
              disabled={isDateDisabled(date)}
              className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                isDateDisabled(date)
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : isDateSelected(date)
                  ? "bg-[#E76F51] text-white"
                  : "bg-gray-100 text-[#2D2D2D] hover:bg-gray-200"
              }`}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots Section */}
      {selectedDate && (
        <div>
          <h3 className="text-[#2D2D2D] font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock size={20} />
            Available Times
          </h3>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E76F51] rounded-full"></div>
              </div>
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-[#4B5563] text-center py-8">No available slots on this date</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-3 rounded-xl font-semibold text-sm transition-all ${
                    selectedSlot === slot
                      ? "bg-[#E76F51] text-white"
                      : "bg-gray-100 text-[#2D2D2D] hover:bg-gray-200"
                  }`}
                >
                  {slot.start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Button */}
      {selectedSlot && (
        <button
          onClick={handleBookSlot}
          disabled={bookingLoading}
          className="w-full py-3 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all disabled:opacity-50 font-semibold"
        >
          {bookingLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Confirming...
            </span>
          ) : (
            `Confirm Booking for ${selectedSlot.start.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit"
            })}`
          )}
        </button>
      )}
    </div>
  );
}

export default AvailabilityCalendar;
