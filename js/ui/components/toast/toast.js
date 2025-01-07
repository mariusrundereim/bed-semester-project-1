import { TimeFormatter } from "../../../utils/formatDuration.js";

export class Toast {
  constructor() {
    this.container = document.getElementById("toastContainer");
    if (!this.container) {
      this.container = this.createContainer();
    }
    this.shownNotifications = new Set();
    this.bootstrapToast = null;
  }

  createContainer() {
    const container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(container);
    return container;
  }

  createToastElement({ title, body, type = "info" }) {
    const toastElement = document.createElement("div");
    toastElement.className = "toast";
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    const headerClass = type === "error" ? "bg-danger text-white" : "";
    toastElement.innerHTML = `
      <div class="toast-header ${headerClass}">
        <strong class="me-auto">${title}</strong>
        <small>just now</small>
        <button type="button" class="btn-close ${
          type === "error" ? "btn-close-white" : ""
        }" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${body}
      </div>
    `;
    return toastElement;
  }

  show(options) {
    const toastElement = this.createToastElement(options);
    this.container.appendChild(toastElement);

    const bootstrapToast = new bootstrap.Toast(toastElement, {
      autohide: false,
    });

    bootstrapToast.show();

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }

  showStaffLateNotification(staff, delayMinutes) {
    if (!delayMinutes || delayMinutes <= 0) return;

    const notificationId = `${staff.email}-${staff.expectedReturnTime}`;

    if (this.shownNotifications.has(notificationId)) return;
    this.shownNotifications.add(notificationId);

    const delayText = TimeFormatter.calculateDelayFromTimeString(
      staff.expectedReturnTime
    );

    const body = `
      <div class="d-flex align-items-center">
        <img src="${
          staff.picture
        }" alt="" class="rounded-circle me-2" width="40">
        <div>
          <strong>${staff.name} ${
      staff.surname
    }</strong> is late by ${delayText}.<br>
          <small class="text-muted">Expected: ${
            staff.expectedReturnTime
          }</small><br>
          <small class="text-muted">Current time: ${new Date().toLocaleTimeString()}</small>
        </div>
      </div>
      <div class="mt-2">
        <button class="btn btn-danger btn-sm me-2" id="reportButton">
          Report to Manager
        </button>
        <button class="btn btn-danger btn-sm me-2" id="callButton">
          Call Staff Member
        </button>
      </div>`;

    const toastElement = this.createToastElement({
      title: "Staff Member Late",
      body,
      type: "error",
    });

    toastElement
      .querySelector("#reportButton")
      .addEventListener("click", () => {
        this.reportLateStaff(staff, delayText);
      });

    toastElement.querySelector("#callButton").addEventListener("click", () => {
      this.callStaffMember(staff);
    });

    // Remove from tracking when toast is closed
    toastElement.addEventListener("hidden.bs.toast", () => {
      this.shownNotifications.delete(notificationId);
    });

    this.container.appendChild(toastElement);
    new bootstrap.Toast(toastElement, { autohide: false }).show();
  }

  reportLateStaff(staff, delayDuration) {
    const timestamp = new Date().toLocaleString();
    console.log(
      `LATE STAFF REPORT - ${timestamp}:
      Staff Member: ${staff.name} ${staff.surname}
      Email: ${staff.email}
      Delay: ${delayDuration}
      Expected Return: ${staff.expectedReturnTime}`
    );
  }

  callStaffMember(staff) {
    console.log(`Initiating call to ${staff.name} ${staff.surname}`);
  }

  showDeliveryLateNotification(driver) {
    // Create unique ID for this notification
    const notificationId = `delivery-${driver.telephone}-${driver.returnTime}`;

    // Don't show duplicate notifications
    if (this.shownNotifications.has(notificationId)) return;
    this.shownNotifications.add(notificationId);

    const currentTime = new Date();
    const expectedReturn = new Date(driver.returnTime);
    const delayText = TimeFormatter.calculateDelay(currentTime, expectedReturn);

    const body = `
      <div class="mb-2">
        <strong>Driver:</strong> ${driver.name} ${driver.surname}<br>
        <strong>Phone:</strong> ${driver.telephone}<br>
        <strong>Address:</strong> ${driver.deliveryAddress}<br>
        <strong>Expected Return:</strong> ${driver.returnTime}<br>
        <small class="text-muted">Late by: ${delayText}</small><br>
        <small class="text-muted">Current time: ${currentTime.toLocaleTimeString()}</small>
      </div>
      <div>
        <button class="btn btn-primary btn-sm me-2" onclick="window.location.href='tel:${
          driver.telephone
        }'">
          Call Driver
        </button>
      </div>`;

    const toastElement = this.createToastElement({
      title: "Late Delivery Alert",
      body,
      type: "error",
    });

    // Remove from tracking when toast is closed
    toastElement.addEventListener("hidden.bs.toast", () => {
      this.shownNotifications.delete(notificationId);
    });

    this.container.appendChild(toastElement);
    new bootstrap.Toast(toastElement, { autohide: false }).show();
  }
}
