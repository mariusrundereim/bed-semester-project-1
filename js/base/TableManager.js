export class TableManager {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    if (!this.table) {
      throw new Error(`Table with id '${tableId}' not found`);
    }
    this.tbody = this.table.querySelector("tbody") || this.createTableBody();
    this.selectedRow = null;
  }

  createTableBody() {
    const tbody = document.createElement("tbody");
    this.table.appendChild(tbody);
    return tbody;
  }

  updateTable(items, rowRenderer) {
    this.tbody.innerHTML =
      items.length === 0
        ? this.getEmptyStateHTML()
        : items.map(rowRenderer).join("");
  }

  getEmptyStateHTML() {
    return `
        <tr>
          <td colspan="100%" class="text-center py-4">
            <div class="d-flex flex-column align-items-center">
              <i class="bi bi-inbox text-muted mb-2" style="font-size: 2rem;"></i>
              <span class="text-muted">No items to display</span>
            </div>
          </td>
        </tr>
      `;
  }

  selectRow(row) {
    // Remove previous selection
    this.tbody.querySelectorAll("tr").forEach((r) => {
      r.classList.remove("table-active");
    });

    // Add new selection
    if (row) {
      row.classList.add("table-active");
      this.selectedRow = row;
    } else {
      this.selectedRow = null;
    }
  }

  clearSelection() {
    this.selectRow(null);
  }

  bindRowClick(callback) {
    this.tbody.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row) return;

      this.selectRow(row);
      if (callback) callback(row);
    });
  }
}
