import { DeliveryDriver } from "../models/deliveryDriver.js";
import { Toast } from "../ui/toast/toast.js";

export class DeliveryManager {
  static VALIDATION_RULES = {
    name: {
      pattern: /^[A-Za-z\s]+$/,
      message: "Name should contain only letters",
    },
    telephone: {
      minLength: 7,
      message: "Phone number should be at least 7 digits",
    },
    address: {
      minLength: 5,
      message: "Please enter a valid delivery address",
    },
    time: {
      pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: "Please enter a valid time in HH:MM format",
    },
  };

  constructor() {
    this.deliveries = [];
    this.toast = new Toast();
    this.tableBody = null;
    this.form = null;

    this.initialize();
  }

  initialize() {
    // Cache DOM elements
    this.tableBody =
      document.querySelector("#deliveryTable tbody") ||
      this.createTableStructure();
    this.form = {
      vehicle: document.getElementById("vehicleType"),
      name: document.getElementById("deliveryName"),
      surname: document.getElementById("deliverySurname"),
      telephone: document.getElementById("deliveryTelephone"),
      address: document.getElementById("deliveryAddress"),
      returnTime: document.getElementById("returnTime"),
    };

    this.bindEvents();
    this.startLateCheckInterval();
    this.renderDeliveryBoard();
  }

  createTableStructure() {
    const table = document.getElementById("deliveryTable");
    if (!table) {
      console.error("Delivery table not found");
      return null;
    }

    // Create thead if needed
    if (!table.querySelector("thead")) {
      table.insertAdjacentHTML(
        "beforeend",
        `
        <thead>
          <tr>
            <th>Vehicle Type</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Telephone</th>
            <th>Delivery Address</th>
            <th>Return Time</th>
            <th>Actions</th>
          </tr>
        </thead>
      `
      );
    }

    // Create and return tbody
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    return tbody;
  }

  bindEvents() {
    // Use event delegation for better performance
    document.getElementById("deliveryTable").addEventListener("click", (e) => {
      if (e.target.matches(".clear-btn")) {
        this.handleClearDelivery(e);
      }
    });

    document.getElementById("addDeliveryBtn").addEventListener("click", () => {
      this.handleAddDelivery();
    });

    // Input validation
    this.form.telephone.addEventListener("input", this.handlePhoneInput);
  }

  handlePhoneInput(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
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

  handleClearDelivery(e) {
    const index = parseInt(e.target.dataset.index);
    if (confirm("Are you sure you want to remove this delivery?")) {
      this.deliveries.splice(index, 1);
      this.renderDeliveryBoard();
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
    // Check for empty fields
    const emptyField = Object.entries(data).find(([key, value]) => !value);

    if (emptyField) {
      return {
        isValid: false,
        message: `${
          emptyField[0].charAt(0).toUpperCase() + emptyField[0].slice(1)
        } is required`,
      };
    }

    // Validate against rules
    for (const [field, value] of Object.entries(data)) {
      const rule = DeliveryManager.VALIDATION_RULES[field];
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
    await this.renderDeliveryBoard();
  }

  renderDeliveryBoard() {
    if (!this.tableBody) return;

    const content =
      this.deliveries.length === 0
        ? this.getEmptyStateHTML()
        : this.getDeliveriesHTML();

    this.tableBody.innerHTML = content;
  }

  getEmptyStateHTML() {
    return `
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="d-flex flex-column align-items-center">
            <i class="bi bi-inbox text-muted mb-2" style="font-size: 2rem;"></i>
            <span class="text-muted">No deliveries at this moment</span>
          </div>
        </td>
      </tr>
    `;
  }

  getDeliveriesHTML() {
    return this.deliveries
      .map(
        (driver, index) => `
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
      `
      )
      .join("");
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
