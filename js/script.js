import { StaffService } from "./services/staffService.js";
import { StaffTableManager } from "./ui/components/tables/StaffTableManager.js";
import { DeliveryTableManager } from "./ui/components/tables/DeliveryTableManager.js";
import { StaffMemberModal } from "./ui/modals/staffModal.js";
import { startClock } from "./utils/digitalClock.js";

async function initialize() {
  try {
    const modal = new StaffMemberModal();
    const staffTable = new StaffTableManager(modal);
    const deliveryTable = new DeliveryTableManager();

    const staffList = await StaffService.staffUserGet();
    staffTable.updateTable(staffList, staffTable.createStaffRow);

    // Digital clock
    startClock();
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

document.addEventListener("DOMContentLoaded", initialize);
