"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets the current date and time in GMT+1 (Central European Time).
 * @returns {Object} - An object containing formatted hour, current month, current year, and current day.
 */
const getCurrentDateTime = () => {
    // Get current date in UTC
    const utcNow = new Date();
    // Convert UTC time to GMT+1 (Central European Time)
    const gmtPlus1Time = new Date(utcNow.getTime() + 3600000); // Add 1 hour (3600000 milliseconds)
    // Extract hour and format it with leading zero if necessary
    const hour = gmtPlus1Time.getUTCHours();
    const formattedHour = hour < 10 ? "0" + hour : hour;
    // Extract current month, year, and day
    const currentMonth = gmtPlus1Time.getMonth() + 1;
    const currentYear = gmtPlus1Time.getFullYear();
    const currentDay = gmtPlus1Time.getDate();
    // Return an object containing formatted hour, current month, current year, and current day
    return {
        formattedHour,
        currentMonth,
        currentYear,
        currentDay,
    };
};
exports.default = getCurrentDateTime;
//# sourceMappingURL=datetime.js.map