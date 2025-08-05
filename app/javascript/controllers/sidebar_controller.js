// app/javascript/controllers/sidebar_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["sidebar"];

  connect() {
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.sidebarTarget.classList.toggle("collapsed");
  }
}
