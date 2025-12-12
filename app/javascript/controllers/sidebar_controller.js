import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sidebar", "leftCurtain", "chevronLeft", "chevronRight", "banner", "galleries", "pieces", "members", "videos", "contact"]

  connect() {
    this.updateLayout = this.updateLayout.bind(this)
    this.updateLayout()
    window.addEventListener("resize", this.updateLayout, { passive: true })
  }

  disconnect() {
    window.removeEventListener("resize", this.updateLayout)
  }

  toggle() {
    this.sidebarTarget.classList.toggle("collapsed")
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

    // ✅ Mobile = mode light => AUCUNE marge appliquée au contenu
    if (isMobile) {
      const rightWidth = isCollapsed ? "80px" : "0px"
      const leftWidth  = "0px"

      this.applyLR(this.bannerTarget, leftWidth, rightWidth)
      this.applyLR(this.piecesTarget, leftWidth, rightWidth)
      this.applyLR(this.membersTarget, leftWidth, rightWidth)
      this.applyLR(this.galleriesTarget, leftWidth, rightWidth)
      this.applyLR(this.videosTarget, leftWidth, rightWidth)
      this.applyLR(this.contactTarget, leftWidth, rightWidth)

      return
    }


    // Desktop = marges comme avant
    const rightWidth = isCollapsed ? "80px" : "220px"
    const leftWidth  = isCollapsed ? "80px" : "220px"

    this.applyLR(this.bannerTarget, leftWidth, rightWidth)
    this.applyLR(this.piecesTarget, leftWidth, rightWidth)
    this.applyLR(this.membersTarget, leftWidth, rightWidth)
    this.applyLR(this.galleriesTarget, leftWidth, rightWidth)
    this.applyLR(this.videosTarget, leftWidth, rightWidth)
    this.applyLR(this.contactTarget, leftWidth, rightWidth)
  }

  applyLR(el, leftWidth, rightWidth) {
    if (!el) return
    el.style.marginLeft  = leftWidth
    el.style.marginRight = rightWidth
    el.style.width = `calc(100% - (${leftWidth} + ${rightWidth}))`
    el.style.transition = "margin 0.3s ease, width 0.3s ease"
  }

  clearLR(el) {
    if (!el) return
    el.style.marginLeft = ""
    el.style.marginRight = ""
    el.style.width = ""
    el.style.transition = ""
  }
}
