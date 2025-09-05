import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sidebar", "banner", "pieces", "chevronLeft", "chevronRight", "members", "member"]

  connect() {
    this.updateLayout()
  }

  toggle() {
    this.sidebarTarget.classList.toggle("collapsed")
    this.updateLayout()
  }

  updateLayout() {
    const isCollapsed = this.sidebarTarget.classList.contains("collapsed")

    // icônes chevrons
    if (this.hasChevronLeftTarget && this.hasChevronRightTarget) {
      this.chevronLeftTarget.style.display  = isCollapsed ? "inline-block" : "none"
      this.chevronRightTarget.style.display = isCollapsed ? "none" : "inline-block"
    }

    const width = isCollapsed ? "80px" : "220px"

    // bannière (si présente sur la page)
    if (this.hasBannerTarget) {
      this.bannerTarget.style.marginRight = width
      this.bannerTarget.style.width = `calc(100% - ${width})`
    }

    // wrapper des pièces (si présent sur la page)
    if (this.hasPiecesTarget) {
      this.piecesTarget.style.marginRight = width
      this.piecesTarget.style.width = `calc(100% - ${width})`
    }

    if (this.hasMembersTarget) {
      this.membersTarget.style.marginRight = width
      this.membersTarget.style.width = `calc(100% - ${width})`
    }

    if (this.hasMemberTarget) {
      this.memberTarget.style.marginRight = width
      this.memberTarget.style.width = `calc(100% - ${width})`
    }
  }
}
