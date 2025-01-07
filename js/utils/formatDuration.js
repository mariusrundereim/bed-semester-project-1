export class TimeFormatter {
  static formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0
      ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}`
      : `${minutes}m`;
  }

  static calculateDelay(currentTime, expectedReturn) {
    const diffInMinutes = Math.floor(
      (currentTime - expectedReturn) / (1000 * 60)
    );
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    const hourText = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
    const minuteText = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    return hours > 0 ? `${hourText} and ${minuteText}` : minuteText;
  }

  static calculateDelayFromTimeString(timeStr) {
    try {
      const currentTime = new Date();
      const [timeComponent, period] = timeStr.split(" ");
      const [inputHours, inputMinutes] = timeComponent.split(":");

      // Create a date object for the expected return time
      const expectedReturn = new Date();
      let targetHour = parseInt(inputHours);

      // Convert to 24-hour format if needed
      if (period?.toUpperCase() === "PM" && targetHour !== 12) {
        targetHour += 12;
      } else if (period?.toUpperCase() === "AM" && targetHour === 12) {
        targetHour = 0;
      }

      expectedReturn.setHours(targetHour);
      expectedReturn.setMinutes(parseInt(inputMinutes));
      expectedReturn.setSeconds(0);

      // Calculate delay in minutes
      const delayMinutes = Math.floor(
        (currentTime - expectedReturn) / (1000 * 60)
      );

      if (delayMinutes <= 0) return "0 minutes";

      const delayHours = Math.floor(delayMinutes / 60);
      const delayRemainingMinutes = delayMinutes % 60;

      const delayHourText =
        delayHours > 0 ? `${delayHours} hour${delayHours > 1 ? "s" : ""}` : "";
      const delayMinuteText = `${delayRemainingMinutes} minute${
        delayRemainingMinutes !== 1 ? "s" : ""
      }`;

      return delayHours > 0
        ? `${delayHourText} and ${delayMinuteText}`
        : delayMinuteText;
    } catch (error) {
      console.warn("Error calculating delay from time string:", timeStr);
      return "0 minutes";
    }
  }
}

/*
export class TimeFormatter {
  static formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0
      ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}`
      : `${minutes}m`;
  }

  static calculateDelay(currentTime, expectedReturn) {
    const diffInMinutes = Math.floor(
      (currentTime - expectedReturn) / (1000 * 60)
    );
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    const hourText = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
    const minuteText = `${minutes} minute${minutes !== 1 ? "s" : ""}`;

    return hours > 0 ? `${hourText} and ${minuteText}` : minuteText;
  }
}
*/
