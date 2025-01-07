export class StaffMemberModal {
  constructor() {
    this.modalInstance = null;
    this.currentStaff = null;
    this.initialize();
    this.initializeEventListeners();
    this.initializeConfirmationModal();
  }

  initialize() {
    const modalHTML = `
      <div class="modal fade" id="staffModal" tabindex="-1" aria-labelledby="staffModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staffModalLabel">Staff Member</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div id="staffDetails"></div>
              <div class="mb-3">
                <label for="duration" class="form-label">Duration (minutes)</label>
                <input type="number" class="form-control" id="duration" min="1" required>
                <div id="durationDisplay" class="alert alert-info mt-2 d-none">
                  Duration: <span id="formattedDuration"></span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirmBtn">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (!document.getElementById("staffModal")) {
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    const modalElement = document.getElementById("staffModal");
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }

    this.initializeDurationHandlers();
  }

  initializeEventListeners() {
    const modalElement = document.getElementById("staffModal");
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", () => {
        this.resetModal();
      });
    }
  }

  initializeDurationHandlers() {
    const durationInput = document.getElementById("duration");
    const durationDisplay = document.getElementById("durationDisplay");
    const formattedDuration = document.getElementById("formattedDuration");
    const confirmBtn = document.getElementById("confirmBtn");

    if (durationInput && durationDisplay && formattedDuration) {
      durationInput.addEventListener("input", () => {
        this.handleDurationInput(
          durationInput,
          durationDisplay,
          formattedDuration
        );
      });
    }

    if (confirmBtn) {
      confirmBtn.onclick = () => this.handleConfirm(durationInput);
    }
  }

  // Confirmation

  initializeConfirmationModal() {
    const confirmModalHTML = `
      <div class="modal fade" id="confirmInModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Clock In</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to clock in this staff member?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirmInBtn">Confirm</button>
            </div>
          </div>
        </div>
      </div>`;

    if (!document.getElementById("confirmInModal")) {
      document.body.insertAdjacentHTML("beforeend", confirmModalHTML);
    }
  }

  showConfirmInModal(callback) {
    const modal = new bootstrap.Modal(
      document.getElementById("confirmInModal")
    );
    const confirmBtn = document.getElementById("confirmInBtn");

    confirmBtn.onclick = () => {
      callback();
      modal.hide();
    };

    modal.show();
  }

  showStaffInfo(staff) {
    this.currentStaff = staff;
    this.updateStaffDetails();
    this.show();
  }

  showStatusModal(staff) {
    this.currentStaff = staff;
    this.updateStaffDetails();
    this.show();
  }

  updateStaffDetails() {
    const staffDetails = document.getElementById("staffDetails");
    if (staffDetails && this.currentStaff) {
      staffDetails.innerHTML = `
        <div class="d-flex align-items-center mb-3">
          <img src="${this.currentStaff.picture}" alt="${this.currentStaff.name}" class="rounded-circle me-3" width="50">
          <div>
            <h6 class="mb-1">${this.currentStaff.name} ${this.currentStaff.surname}</h6>
            <p class="mb-0">${this.currentStaff.email}</p>
          </div>
        </div>
      `;
    }
  }

  handleDurationInput(input, display, formatted) {
    const minutes = parseInt(input.value);
    if (!minutes) {
      display.classList.add("d-none");
      return;
    }

    formatted.textContent = this.formatDuration(minutes);
    display.classList.remove("d-none");
  }

  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}${
        remainingMinutes > 0
          ? ` and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
          : ""
      }`;
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  handleConfirm(durationInput) {
    const minutes = parseInt(durationInput?.value || "0");
    if (minutes > 0 && this.currentStaff) {
      if (typeof this.onConfirm === "function") {
        this.onConfirm(minutes);
      }
      this.hide();
    }
  }

  resetModal() {
    const durationInput = document.getElementById("duration");
    const durationDisplay = document.getElementById("durationDisplay");
    if (durationInput) durationInput.value = "";
    if (durationDisplay) durationDisplay.classList.add("d-none");
    this.currentStaff = null;
  }

  show() {
    this.modalInstance?.show();
  }

  hide() {
    this.modalInstance?.hide();
  }
}
