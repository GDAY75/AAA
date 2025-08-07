import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sidebar", "banner"]

  connect() {
    this.updateBannerWidth()
  }

  toggle() {
    this.sidebarTarget.classList.toggle("collapsed")
    this.updateBannerWidth()
  }

  updateBannerWidth() {
    if (!this.hasBannerTarget) return

    const isCollapsed = this.sidebarTarget.classList.contains("collapsed")
    const width = isCollapsed ? "80px" : "220px"

    this.bannerTarget.style.marginRight = width
    this.bannerTarget.style.width = `calc(100% - ${width})`
  }
}
