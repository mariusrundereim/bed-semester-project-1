import { TableManager } from "../../../base/TableManager.js";
import { DeliveryDriver } from "../../../models/deliveryDriver.js";
import { Toast } from "../../components/toast/toast.js";
import { ValidationRules } from "../../../utils/validation.js";

export class DeliveryTableManager extends TableManager {
  constructor() {
    super("deliveryTable");

    this.deliveries = [];
    this.toast = new Toast();
    this.initializeForm();
    this.bindEvents();
    this.startLateCheckInterval();
    this.updateTable(this.deliveries, this.createDeliveryRow.bind(this));
  }

  initializeForm() {
    this.form = {
      vehicle: document.getElementById("vehicleType"),
      name: document.getElementById("deliveryName"),
      surname: document.getElementById("deliverySurname"),
      telephone: document.getElementById("deliveryTelephone"),
      address: document.getElementById("deliveryAddress"),
      returnTime: document.getElementById("returnTime"),
    };
  }

  bindEvents() {
    // Existing row click binding
    this.bindRowClick((row) => {
      const index = row.querySelector(".clear-btn")?.dataset.index;
      if (index) {
        this.selectedDeliveryIndex = parseInt(index);
      }
    });

    // Add Clear button handler
    this.tbody.addEventListener("click", (e) => {
      if (e.target.matches(".clear-btn")) {
        this.handleClearDelivery(e);
      }
    });

    document.getElementById("addDeliveryBtn").addEventListener("click", () => {
      this.handleAddDelivery();
    });

    this.form.telephone.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
  }

  handleClearDelivery(e) {
    const index = parseInt(e.target.dataset.index);
    if (confirm("Are you sure you want to remove this delivery?")) {
      this.deliveries.splice(index, 1);
      this.updateTable(this.deliveries, this.createDeliveryRow.bind(this));
    }
  }

  async handleAddDelivery() {
    const formData = this.getFormData();
    const validationResult = this.validateDelivery(formData);

    if (validationResult.isValid) {
      await this.addDelivery(formData);
      this.clearForm();
    } else {
      this.showError(validationResult.message);
    }
  }

  getFormData() {
    return Object.fromEntries(
      Object.entries(this.form).map(([key, element]) => [
        key,
        element.value.trim(),
      ])
    );
  }

  validateDelivery(data) {
    // Check empty fields
    const emptyField = Object.entries(data).find(([key, value]) => !value);
    if (emptyField) {
      return {
        isValid: false,
        message: `${
          emptyField[0].charAt(0).toUpperCase() + emptyField[0].slice(1)
        } is required`,
      };
    }

    // Check validation rules
    for (const [field, value] of Object.entries(data)) {
      const rule = ValidationRules[field];
      if (rule) {
        if (rule.pattern && !rule.pattern.test(value)) {
          return { isValid: false, message: rule.message };
        }
        if (rule.minLength && value.length < rule.minLength) {
          return { isValid: false, message: rule.message };
        }
      }
    }

    // Validate return time
    const [hours, minutes] = data.returnTime.split(":");
    const returnTime = new Date();
    returnTime.setHours(parseInt(hours), parseInt(minutes), 0);

    if (returnTime < new Date()) {
      return { isValid: false, message: "Return time must be in the future" };
    }

    return { isValid: true };
  }

  async addDelivery(data) {
    const driver = new DeliveryDriver(
      data.name,
      data.surname,
      data.vehicle,
      data.telephone,
      data.address,
      data.returnTime
    );

    this.deliveries.push(driver);
    this.updateTable(this.deliveries, this.createDeliveryRow.bind(this));
  }

  createDeliveryRow(driver, index) {
    return `
      <tr>
        <td>${driver.getVehicleIcon()} ${driver.vehicle}</td>
        <td>${driver.name}</td>
        <td>${driver.surname}</td>
        <td>${driver.telephone}</td>
        <td>${driver.deliveryAddress}</td>
        <td>${driver.returnTime}</td>
        <td>
          <button class="btn btn-danger btn-sm clear-btn" data-index="${index}">
            Clear
          </button>
        </td>
      </tr>
    `;
  }

  showError(message) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-danger alert-dismissible show mt-3";
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector(".card-body").appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 6000);
  }

  startLateCheckInterval() {
    setInterval(() => {
      const lateDrivers = this.deliveries.filter((driver) =>
        driver.deliveryDriverIsLate()
      );
      lateDrivers.forEach((driver) =>
        this.toast.showDeliveryLateNotification(driver)
      );
    }, 60000);
  }

  clearForm() {
    Object.values(this.form).forEach((element) => {
      element.value =
        element.type === "select-one" ? element.options[0].value : "";
    });
  }
}
