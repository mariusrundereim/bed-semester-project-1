import { DeliveryDriver } from "../models/deliveryDriver.js";

export class DeliveryService {
  static validateDelivery(data) {
    // Check for empty fields
    for (const [key, value] of Object.entries(data)) {
      if (!value) {
        throw new Error(
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
        );
      }
    }

    // Validate name and surname
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(data.name) || !nameRegex.test(data.surname)) {
      throw new Error("Name and surname should contain only letters");
    }

    // Validate phone number
    if (data.telephone.length < 10) {
      throw new Error("Phone number should be at least 10 digits");
    }

    // Validate return time
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.returnTime)) {
      throw new Error("Please enter a valid time in HH:MM format");
    }

    const [hours, minutes] = data.returnTime.split(":");
    const returnTime = new Date();
    returnTime.setHours(parseInt(hours), parseInt(minutes), 0);

    if (returnTime < new Date()) {
      throw new Error("Return time must be in the future");
    }

    return true;
  }

  static createDeliveryDriver(data) {
    return new DeliveryDriver(
      data.name,
      data.surname,
      data.vehicle,
      data.telephone,
      data.address,
      data.returnTime
    );
  }
}
