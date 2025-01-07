import { TableManager } from "../../../base/TableManager.js";
import { StaffService } from "../../../services/staffService.js";
import { TimeFormatter } from "../../../utils/formatDuration.js";

export class StaffTableManager extends TableManager {
  constructor(modal) {
    super("staffTable");

    if (!modal) {
      throw new Error("Modal instance is required");
    }

    this.modal = modal;
    this.staffList = [];
    this.selectedStaff = null;

    this.createButtons();
    this.initializeEvents();
  }

  createButtons() {
    let buttonContainer = document.querySelector(".button-container");
    if (!buttonContainer) {
      buttonContainer = document.createElement("div");
      buttonContainer.className =
        "button-container d-flex justify-content-between m-3";
      this.table.parentElement.insertAdjacentElement(
        "afterend",
        buttonContainer
      );
    }

    this.inBtn = this.createButton(
      "inBtn",
      "In",
      "btn-success",
      buttonContainer
    );
    this.outBtn = this.createButton(
      "outBtn",
      "Out",
      "btn-danger",
      buttonContainer
    );
  }

  createButton(id, text, className, container) {
    let button = document.getElementById(id);
    if (!button) {
      button = document.createElement("button");
      button.id = id;
      button.className = `btn ${className}`;
      button.textContent = text;
      container.appendChild(button);
    }
    return button;
  }

  initializeEvents() {
    // Table row selection
    this.tbody.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row) return;

      // Remove previous selection
      this.tbody.querySelectorAll("tr").forEach((row) => {
        row.classList.remove("table-active");
      });

      // Add new selection
      row.classList.add("table-active");
      const email = row.dataset.email;

      if (email) {
        this.selectedStaff = this.findStaffByEmail(email);
      }
    });

    // Button events
    this.outBtn.addEventListener("click", () => this.handleOutClick());
    this.inBtn.addEventListener("click", () => this.handleInClick());
  }

  handleOutClick() {
    if (!this.selectedStaff) {
      alert("Please select a staff member first");
      return;
    }
    if (this.selectedStaff.status === "Out") {
      alert("Staff member is already out");
      return;
    }
    this.modal.showStatusModal(this.selectedStaff);
    this.setupModalCallback();
  }

  handleInClick() {
    if (!this.selectedStaff) {
      alert("Please select a staff member first");
      return;
    }
    if (this.selectedStaff.status !== "Out") {
      alert("Staff member is already in");
      return;
    }
    this.modal.showConfirmInModal(() => {
      this.updateStaffStatus(this.selectedStaff, "In");
    });
  }

  setupModalCallback() {
    this.modal.onConfirm = (duration) => {
      if (this.selectedStaff) {
        this.updateStaffStatus(this.selectedStaff, "Out", duration);
      }
    };
  }

  updateStaffStatus(staff, status, duration = null) {
    const currentTime = new Date();

    if (status === "Out" && duration) {
      const expectedReturn = new Date(currentTime.getTime() + duration * 60000);

      staff.status = "Out";
      staff.outTime = currentTime.toLocaleTimeString();
      staff.duration = TimeFormatter.formatDuration(duration);
      staff.expectedReturnTime = expectedReturn.toLocaleTimeString();
      staff.expectedReturnDate = expectedReturn;
      staff.notificationShown = false;
    } else if (status === "In") {
      staff.status = "In";
      staff.outTime = "";
      staff.duration = "";
      staff.expectedReturnTime = "";
      staff.expectedReturnDate = null;
      staff.notificationShown = false;
    }

    this.updateTable(this.staffList, this.createStaffRow);
    this.selectedStaff = null;
    this.clearSelection();
  }

  findStaffByEmail(email) {
    return this.staffList.find((staff) => staff.email === email);
  }

  createStaffRow(staff) {
    return `
      <tr data-email="${staff.email}">
        <td><img src="${staff.picture}" alt="${
      staff.name
    }" class="rounded-circle" width="50"></td>
        <td>${staff.name}</td>
        <td>${staff.surname}</td>
        <td>${staff.email}</td>
        <td>${staff.status || "In"}</td>
        <td>${staff.outTime || ""}</td>
        <td>${staff.duration || ""}</td>
        <td>${staff.expectedReturnTime || ""}</td>
      </tr>
    `;
  }

  updateTable(staffList) {
    this.staffList = staffList;
    this.tbody.innerHTML = staffList
      .map((staff) => this.createStaffRow(staff))
      .join("");
  }
}
