import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sidebar", "leftCurtain", "chevronLeft", "chevronRight", "banner", "galleries", "pieces", "members", "videos", "contact"]

  connect() {
    this.updateLayout = this.updateLayout.bind(this)

    const collapsed = this.sidebarTarget.classList.contains("collapsed")
    document.body.classList.toggle("is-collapsed", collapsed)
    document.body.classList.toggle("is-open", !collapsed)

    this.updateLayout()
    window.addEventListener("resize", this.updateLayout, { passive: true })
  }

  disconnect() {
    window.removeEventListener("resize", this.updateLayout)
  }

  toggle() {
    const collapsed = this.sidebarTarget.classList.toggle("collapsed") // ✅ UNE seule fois

    document.body.classList.toggle("is-collapsed", collapsed)
    document.body.classList.toggle("is-open", !collapsed)

    this.updateLayout()
  }

  updateLayout() {
    const isCollapsed = this.sidebarTarget.classList.contains("collapsed")
    const isMobile = window.matchMedia("(max-width: 768px)").matches

    // chevrons
    if (this.hasChevronLeftTarget && this.hasChevronRightTarget) {
      this.chevronLeftTarget.style.display  = isCollapsed ? "inline-block" : "none"
      this.chevronRightTarget.style.display = isCollapsed ? "none" : "inline-block"
    }

    // Rideau gauche (desktop)
    if (this.hasLeftCurtainTarget) {
      if (isMobile) {
        this.leftCurtainTarget.classList.remove("is-collapsed")
      } else {
        this.leftCurtainTarget.classList.toggle("is-collapsed", isCollapsed)
      }
    }
  }
}
