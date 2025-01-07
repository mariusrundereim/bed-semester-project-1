import { API_CONFIG } from "../api/config.js";
import { StaffMember } from "../models/staffMember.js";
import { Toast } from "../ui/components/toast/toast.js";
import { TimeFormatter } from "../utils/formatDuration.js";
export class StaffService {
  static staffList = [];

  constructor() {
    this.toast = new Toast();
    this.lateCheckInterval = null;
  }

  static async staffUserGet() {
    try {
      const response = await fetch(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.staff
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.staffList = this.processStaffData(data.results);

      const staffService = new StaffService();
      staffService.startLateCheck();

      return this.staffList;
    } catch (error) {
      console.error("Error fetching staff data:", error);
      throw error;
    }
  }

  static processStaffData(results) {
    return results
      .map(
        (user) =>
          new StaffMember(
            user.name.first,
            user.name.last,
            user.email,
            user.picture.large
          )
      )
      .slice(0, 5);
  }

  updateStaffStatus(staff, updates) {
    const staffIndex = StaffService.staffList.findIndex(
      (s) => s.email === staff.email
    );
    if (staffIndex !== -1) {
      StaffService.staffList[staffIndex] = { ...staff, ...updates };
    }
    return StaffService.staffList[staffIndex];
  }

  staffOut(staff, duration) {
    const currentTime = new Date();
    const expectedReturn = new Date(currentTime.getTime() + duration * 60000);

    return this.updateStaffStatus(staff, {
      status: "Out",
      outTime: currentTime.toLocaleTimeString(),
      duration: TimeFormatter.formatDuration(duration),
      expectedReturnTime: expectedReturn.toLocaleTimeString(),
      expectedReturnDate: expectedReturn,
      notificationShown: false,
    });
  }

  staffIn(staff) {
    return this.updateStaffStatus(staff, {
      status: "In",
      outTime: "",
      duration: "",
      expectedReturnTime: "",
      expectedReturnDate: null,
      notificationShown: false,
    });
  }

  startLateCheck() {
    if (this.lateCheckInterval) {
      clearInterval(this.lateCheckInterval);
    }

    this.lateCheckInterval = setInterval(() => {
      StaffService.staffList
        .filter((staff) => staff.staffMemberIsLate())
        .forEach((staff) => this.showLateNotification(staff));
    }, 60000);
  }

  showLateNotification(staff) {
    const delayDuration = TimeFormatter.calculateDelay(
      new Date(),
      staff.expectedReturnDate
    );
    this.toast.showStaffLateNotification(staff, delayDuration);
  }
}
