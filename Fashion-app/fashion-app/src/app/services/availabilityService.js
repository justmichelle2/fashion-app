import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * DESIGNER AVAILABILITY SERVICE
 * Manages designer working hours, days off, and booking slots
 */

/**
 * Set designer's working hours and days
 * @param {string} designerId - Designer ID
 * @param {Object} schedule - Schedule configuration
 * @param {Object} schedule.workingHours - Daily working hours { Mon: {start, end}, ... }
 * @param {Array} schedule.daysOff - Days off (dates or recurring days)
 * @param {number} schedule.slotDuration - Duration of booking slot in minutes (default 60)
 * @returns {Promise<void>}
 */
export async function setDesignerSchedule(designerId, schedule) {
  try {
    const scheduleRef = doc(db, "designerSchedules", designerId);
    
    const defaultWorkingHours = {
      Monday: { start: "09:00", end: "18:00", enabled: true },
      Tuesday: { start: "09:00", end: "18:00", enabled: true },
      Wednesday: { start: "09:00", end: "18:00", enabled: true },
      Thursday: { start: "09:00", end: "18:00", enabled: true },
      Friday: { start: "09:00", end: "18:00", enabled: true },
      Saturday: { start: "10:00", end: "16:00", enabled: true },
      Sunday: { start: null, end: null, enabled: false }
    };

    await setDoc(scheduleRef, {
      designerId,
      workingHours: schedule.workingHours || defaultWorkingHours,
      slotDuration: schedule.slotDuration || 60, // minutes
      daysOff: schedule.daysOff || [],
      timezone: schedule.timezone || "UTC",
      status: "available", // available, busy, on-break
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error("Error setting designer schedule:", err);
    throw err;
  }
}

/**
 * Get designer's working schedule
 * @param {string} designerId - Designer ID
 * @returns {Promise<Object>}
 */
export async function getDesignerSchedule(designerId) {
  try {
    const scheduleRef = doc(db, "designerSchedules", designerId);
    const snapshot = await getDoc(scheduleRef);

    if (!snapshot.exists()) {
      // Return default schedule if not set
      return {
        designerId,
        workingHours: {
          Monday: { start: "09:00", end: "18:00", enabled: true },
          Tuesday: { start: "09:00", end: "18:00", enabled: true },
          Wednesday: { start: "09:00", end: "18:00", enabled: true },
          Thursday: { start: "09:00", end: "18:00", enabled: true },
          Friday: { start: "09:00", end: "18:00", enabled: true },
          Saturday: { start: "10:00", end: "16:00", enabled: true },
          Sunday: { start: null, end: null, enabled: false }
        },
        slotDuration: 60,
        daysOff: [],
        status: "available"
      };
    }

    return snapshot.data();
  } catch (err) {
    console.error("Error fetching designer schedule:", err);
    throw err;
  }
}

/**
 * Book a consultation slot
 * @param {string} designerId - Designer ID
 * @param {string} customerId - Customer ID
 * @param {Date} startTime - Booking start time
 * @param {number} durationMinutes - Duration in minutes
 * @param {string} orderId - Associated order ID
 * @returns {Promise<string>} Booking ID
 */
export async function bookSlot(designerId, customerId, startTime, durationMinutes, orderId) {
  try {
    const bookingsRef = collection(db, "bookings");
    
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const bookingDoc = await getDocs(
      query(
        bookingsRef,
        where("designerId", "==", designerId),
        where("startTime", "==", startTime),
        where("status", "==", "confirmed")
      )
    );

    if (bookingDoc.size > 0) {
      throw new Error("This time slot is already booked");
    }

    const newBooking = await getDocs(bookingsRef);
    
    // Add booking
    const booking = {
      designerId,
      customerId,
      orderId,
      startTime,
      endTime,
      durationMinutes,
      status: "confirmed", // confirmed, completed, cancelled
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Get the next ID
    const bookingRef = doc(collection(db, "bookings"));
    await setDoc(bookingRef, booking);

    return bookingRef.id;
  } catch (err) {
    console.error("Error booking slot:", err);
    throw err;
  }
}

/**
 * Get available slots for a designer on a specific date
 * @param {string} designerId - Designer ID
 * @param {Date} date - Date to check availability
 * @returns {Promise<Array>} Array of available time slots
 */
export async function getAvailableSlots(designerId, date) {
  try {
    const schedule = await getDesignerSchedule(designerId);
    const dayName = getDayName(date);

    // Check if day is disabled or is a day off
    if (!schedule.workingHours[dayName]?.enabled) {
      return [];
    }

    const dayOffDate = schedule.daysOff?.find(
      d => new Date(d).toDateString() === date.toDateString()
    );

    if (dayOffDate) {
      return [];
    }

    const { start, end } = schedule.workingHours[dayName];
    const slotDuration = schedule.slotDuration || 60;

    // Get booked slots for this date
    const bookingsRef = collection(db, "bookings");
    const bookedQuery = query(
      bookingsRef,
      where("designerId", "==", designerId),
      where("status", "==", "confirmed")
    );

    const bookedSnapshot = await getDocs(bookedQuery);
    const bookedSlots = bookedSnapshot.docs
      .map(doc => ({
        start: doc.data().startTime.toDate(),
        end: doc.data().endTime.toDate()
      }))
      .filter(slot => slot.start.toDateString() === date.toDateString());

    // Generate available slots
    const slots = [];
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    let currentTime = new Date(date);
    currentTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMin, 0, 0);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

      // Check if slot overlaps with any booking
      const isBooked = bookedSlots.some(
        booking => currentTime < booking.end && slotEnd > booking.start
      );

      if (!isBooked) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
          available: true
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  } catch (err) {
    console.error("Error getting available slots:", err);
    return [];
  }
}

/**
 * Get designer's bookings for a date range
 * @param {string} designerId - Designer ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>}
 */
export async function getDesignerBookings(designerId, startDate, endDate) {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("designerId", "==", designerId),
      where("status", "!=", "cancelled")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate()
      }))
      .filter(booking => 
        booking.startTime >= startDate && booking.startTime <= endDate
      );
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<void>}
 */
export async function cancelBooking(bookingId) {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: "cancelled",
      cancelledAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    throw err;
  }
}

/**
 * Set designer availability status
 * @param {string} designerId - Designer ID
 * @param {string} status - Status: "available", "busy", "on-break"
 * @returns {Promise<void>}
 */
export async function setAvailabilityStatus(designerId, status) {
  try {
    const scheduleRef = doc(db, "designerSchedules", designerId);
    await updateDoc(scheduleRef, {
      status,
      statusUpdatedAt: serverTimestamp()
    });

    // Also update in designers collection
    const designerRef = doc(db, "designers", designerId);
    await updateDoc(designerRef, {
      availability: status
    });
  } catch (err) {
    console.error("Error setting availability status:", err);
    throw err;
  }
}

/**
 * Add day off for designer
 * @param {string} designerId - Designer ID
 * @param {Date} date - Day off date
 * @param {string} reason - Reason for day off
 * @returns {Promise<void>}
 */
export async function addDayOff(designerId, date, reason) {
  try {
    const schedule = await getDesignerSchedule(designerId);
    const updatedDaysOff = schedule.daysOff || [];

    // Add if not already present
    if (!updatedDaysOff.find(d => new Date(d).toDateString() === date.toDateString())) {
      updatedDaysOff.push({
        date: date.toISOString(),
        reason
      });

      const scheduleRef = doc(db, "designerSchedules", designerId);
      await updateDoc(scheduleRef, {
        daysOff: updatedDaysOff
      });
    }
  } catch (err) {
    console.error("Error adding day off:", err);
    throw err;
  }
}

/**
 * Remove day off
 * @param {string} designerId - Designer ID
 * @param {Date} date - Day off date to remove
 * @returns {Promise<void>}
 */
export async function removeDayOff(designerId, date) {
  try {
    const schedule = await getDesignerSchedule(designerId);
    const updatedDaysOff = (schedule.daysOff || []).filter(
      d => new Date(d).toDateString() !== date.toDateString()
    );

    const scheduleRef = doc(db, "designerSchedules", designerId);
    await updateDoc(scheduleRef, {
      daysOff: updatedDaysOff
    });
  } catch (err) {
    console.error("Error removing day off:", err);
    throw err;
  }
}

/**
 * Get availability stats for dashboard
 * @param {string} designerId - Designer ID
 * @returns {Promise<Object>}
 */
export async function getAvailabilityStats(designerId) {
  try {
    const schedule = await getDesignerSchedule(designerId);

    // Get bookings for next 30 days
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const bookings = await getDesignerBookings(designerId, today, thirtyDaysLater);

    return {
      currentStatus: schedule.status,
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter(b => b.startTime > new Date()).length,
      daysOff: schedule.daysOff?.length || 0,
      workingDays: Object.values(schedule.workingHours).filter(d => d.enabled).length
    };
  } catch (err) {
    console.error("Error getting availability stats:", err);
    return {};
  }
}

/**
 * Helper to get day name from date
 */
function getDayName(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
}

export default {
  setDesignerSchedule,
  getDesignerSchedule,
  bookSlot,
  getAvailableSlots,
  getDesignerBookings,
  cancelBooking,
  setAvailabilityStatus,
  addDayOff,
  removeDayOff,
  getAvailabilityStats
};
