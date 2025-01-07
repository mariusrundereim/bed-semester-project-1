import { Employee } from "./employee.js";

export class DeliveryDriver extends Employee {
  constructor(name, surname, vehicle, telephone, deliveryAddress, returnTime) {
    super(name, surname);
    this.vehicle = vehicle;
    this.telephone = telephone;
    this.deliveryAddress = deliveryAddress;
    this.returnTime = returnTime;
    this.hasLateNotificationShown = false;
  }

  deliveryDriverIsLate() {
    if (this.hasLateNotificationShown) return false;

    const currentTime = new Date();
    const [hours, minutes] = this.returnTime.split(":");
    const returnTime = new Date();
    returnTime.setHours(parseInt(hours), parseInt(minutes), 0);

    if (currentTime > returnTime) {
      this.hasLateNotificationShown = true;
      return true;
    }
    return false;
  }

  // Bootstrap Icon
  getVehicleIcon() {
    return this.vehicle === "Car"
      ? '<i class="bi bi-car-front-fill"></i>'
      : '<i class="bi bi-bicycle"></i>';
  }
}
