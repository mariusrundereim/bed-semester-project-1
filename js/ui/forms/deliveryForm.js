// js/ui/forms/deliveryForm.js
export class DeliveryForm {
  constructor() {
    this.form = {
      vehicle: document.getElementById("vehicleType"),
      name: document.getElementById("deliveryName"),
      surname: document.getElementById("deliverySurname"),
      telephone: document.getElementById("deliveryTelephone"),
      address: document.getElementById("deliveryAddress"),
      returnTime: document.getElementById("returnTime"),
    };
    this.bindEvents();
  }

  bindEvents() {
    this.form.telephone.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
  }

  getFormData() {
    return Object.fromEntries(
      Object.entries(this.form).map(([key, element]) => [
        key,
        element.value.trim(),
      ])
    );
  }

  clearForm() {
    Object.values(this.form).forEach((element) => {
      element.value =
        element.type === "select-one" ? element.options[0].value : "";
    });
  }
}
