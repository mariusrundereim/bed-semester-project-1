import { DeliveryService } from "../../service/deliveryService.js";

export class DeliveryManager {
  constructor() {
    this.deliveries = [];
    this.initializeEventListeners();
    this.startLateCheckInterval();
  }

  initializeEventListeners() {
    document.getElementById("addDeliveryBtn").addEventListener("click", () => {
      const formData = this.getFormData();
      this.handleAddDelivery(formData);
    });

    document
      .getElementById("deliveryTelephone")
      .addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      });
  }

  getFormData() {
    return {
      vehicle: document.getElementById("vehicleType").value,
      name: document.getElementById("deliveryName").value.trim(),
      surname: document.getElementById("deliverySurname").value.trim(),
      telephone: document.getElementById("deliveryTelephone").value.trim(),
      address: document.getElementById("deliveryAddress").value.trim(),
      returnTime: document.getElementById("returnTime").value,
    };
  }

  handleAddDelivery(formData) {
    try {
      DeliveryService.validateDelivery(formData);
      const driver = DeliveryService.createDeliveryDriver(formData);
      this.deliveries.push(driver);
      this.updateDeliveryBoard();
      this.clearForm();
    } catch (error) {
      this.showError(error.message);
    }
  }
}
