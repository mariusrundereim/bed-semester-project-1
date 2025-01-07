import { TimeFormatter } from "../../utils/formatDuration.js";

export class StaffMemberUI {
  constructor(modal) {
    if (!modal) {
      throw new Error("Modal instance is required");
    }

    this.modal = modal;
    this.staffList = [];
    this.selectedStaff = null;
    this.tbody = document.querySelector("tbody");

    if (!this.tbody) {
      console.error("Table body not found");
      return;
    }

    this.createButtons();
    this.initializeEvents();
  }

  createButtons() {
    // Find or create button container
    let buttonContainer = document.querySelector(".button-container");
    if (!buttonContainer) {
      buttonContainer = document.createElement("div");
      buttonContainer.className =
        "button-container d-flex justify-content-between m-3";
      this.tbody.parentElement.parentElement.insertAdjacentElement(
        "afterend",
        buttonContainer
      );
    }

    // In button
    this.inBtn = document.getElementById("inBtn");
    if (!this.inBtn) {
      this.inBtn = document.createElement("button");
      this.inBtn.id = "inBtn";
      this.inBtn.className = "btn btn-success";
      this.inBtn.textContent = "In";
      buttonContainer.appendChild(this.inBtn);
    }

    // Out button
    this.outBtn = document.getElementById("outBtn");
    if (!this.outBtn) {
      this.outBtn = document.createElement("button");
      this.outBtn.id = "outBtn";
      this.outBtn.className = "btn btn-danger";
      this.outBtn.textContent = "Out";
      buttonContainer.appendChild(this.outBtn);
    }
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

    // Out button click
    this.outBtn.addEventListener("click", () => {
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
    });

    // In button click
    this.inBtn.addEventListener("click", () => {
      if (!this.selectedStaff) {
        alert("Please select a staff member first");
        return;
      }
      if (this.selectedStaff.status !== "Out") {
        alert("Staff member is already in");
        return;
      }
      this.updateStaffStatus(this.selectedStaff, "In");
    });
  }

  setupModalCallback() {
    // Set up the callback for when duration is confirmed
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

    this.updateTable(this.staffList);
    this.selectedStaff = null;

    // Remove table-active class from all rows after status update
    this.tbody.querySelectorAll("tr").forEach((row) => {
      row.classList.remove("table-active");
    });
  }

  findStaffByEmail(email) {
    return this.staffList.find((staff) => staff.email === email);
  }

  updateTable(staffList) {
    this.staffList = staffList;
    this.tbody.innerHTML = staffList
      .map((staff) => this.createStaffRow(staff))
      .join("");
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
}
