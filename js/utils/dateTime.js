export class DateTime {
  static formatTime(time) {
    if (!time) return "";

    // Full date-time string
    if (time instanceof Date) {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(time);
    }

    // Time-only string (HH:mm)
    if (typeof time === "string" && time.includes(":")) {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }

    return time;
  }

  static getCurrentDateTime() {
    return this.formatTime(new Date());
  }

  static getTimeFromDateString(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
