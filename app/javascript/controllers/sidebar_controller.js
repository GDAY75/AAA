import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sidebar", "leftCurtain", "banner", "galleries", "pieces", "chevronLeft", "chevronRight", "members", "member", "videos"]

  connect() {
    this.updateLayout()
  }

  toggle() {
    this.sidebarTarget.classList.toggle("collapsed")
    this.updateLayout()
  }

  updateLayout() {
    const isCollapsed = this.sidebarTarget.classList.contains("collapsed")
    const isMobile = window.matchMedia("(max-width: 768px)").matches

    // icônes chevrons
    if (this.hasChevronLeftTarget && this.hasChevronRightTarget) {
      this.chevronLeftTarget.style.display  = isCollapsed ? "inline-block" : "none"
      this.chevronRightTarget.style.display = isCollapsed ? "none" : "inline-block"
    }

    const rightWidth = isCollapsed ? "80px"  : "220px"
    const leftWidth  = isMobile    ? "0px"   : (isCollapsed ? "80px" : "220px")

    if (this.hasLeftCurtainTarget) {
      this.leftCurtainTarget.style.width = leftWidth
      this.leftCurtainTarget.style.display = isMobile ? "none" : "block"
    }

    // Applique les marges aux zones de contenu connues
    const applyLR = (el) => {
      if (!el) return
      el.style.marginLeft  = leftWidth
      el.style.marginRight = rightWidth
      el.style.width = `calc(100% - (${leftWidth} + ${rightWidth}))`
      el.style.transition = "margin 0.3s ease, width 0.3s ease"
    }

    if (this.hasBannerTarget)    applyLR(this.bannerTarget)
    if (this.hasPiecesTarget)    applyLR(this.piecesTarget)
    if (this.hasMembersTarget) applyLR(this.membersTarget)
    if (this.hasGalleriesTarget) applyLR(this.galleriesTarget)
    if (this.hasContactTarget)   applyLR(this.contactTarget)
    if (this.hasVideosTarget)   applyLR(this.videosTarget)
  }
}
