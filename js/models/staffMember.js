import { Employee } from "./employee.js";

export class StaffMember extends Employee {
  constructor(name, surname, email, picture) {
    super(name, surname);
    this.email = email;
    this.picture = picture;
    this.status = "In";
    this.outTime = "";
    this.duration = "";
    this.expectedReturnTime = "";
    this.expectedReturnDate = null;
    this.notificationShown = false;
  }

  staffMemberIsLate() {
    if (this.status !== "Out" || !this.expectedReturnDate) {
      return false;
    }

    if (this.notificationShown) {
      return false;
    }

    const currentTime = new Date();

    // Compare current time with expected return time
    const isLate = currentTime > this.expectedReturnDate;

    if (isLate) {
      console.log(`${this.name} is late!`);
      this.notificationShown = true;
    }

    return isLate;
  }
}
