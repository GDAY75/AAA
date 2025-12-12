import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "sidebar",
    "leftCurtain",
    "banner",
    "galleries",
    "pieces",
    "chevronLeft",
    "chevronRight",
    "members",
    "videos",
    "contact"
  ]

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

    // chevrons
    if (this.hasChevronLeftTarget && this.hasChevronRightTarget) {
      this.chevronLeftTarget.style.display  = isCollapsed ? "inline-block" : "none"
      this.chevronRightTarget.style.display = isCollapsed ? "none" : "inline-block"
    }

    // helper pour reset propre en mobile
    const resetLR = (el) => {
      if (!el) return
      el.style.marginLeft = "0px"
      el.style.marginRight = "0px"
      el.style.width = "100%"
      el.style.transition = ""
    }

    // ✅ MOBILE : pas de rideau gauche, mais marge droite si sidebar réduite
    if (isMobile) {
      const rightWidth = isCollapsed ? "80px" : "0px"

      if (this.hasLeftCurtainTarget) {
        this.leftCurtainTarget.style.display = "none"
        this.leftCurtainTarget.style.width = "0px"
      }

      const applyMobile = (el) => {
        if (!el) return
        el.style.marginLeft = "0px"
        el.style.marginRight = rightWidth
        el.style.width = `calc(100% - ${rightWidth})`
        el.style.transition = "margin 0.3s ease, width 0.3s ease"
      }

      if (this.hasBannerTarget)    applyMobile(this.bannerTarget)
      if (this.hasPiecesTarget)    applyMobile(this.piecesTarget)
      if (this.hasMembersTarget)   applyMobile(this.membersTarget)
      if (this.hasGalleriesTarget) applyMobile(this.galleriesTarget)
      if (this.hasVideosTarget)    applyMobile(this.videosTarget)

      return
    }


    // ---- DESKTOP ----
    const rightWidth = isCollapsed ? "80px" : "220px"
    const leftWidth  = isCollapsed ? "80px" : "220px"

    if (this.hasLeftCurtainTarget) {
      this.leftCurtainTarget.style.display = "block"
      this.leftCurtainTarget.style.width = leftWidth
    }

    const applyLR = (el) => {
      if (!el) return
      el.style.marginLeft  = leftWidth
      el.style.marginRight = rightWidth
      el.style.width = `calc(100% - (${leftWidth} + ${rightWidth}))`
      el.style.transition = "margin 0.3s ease, width 0.3s ease"
    }

    if (this.hasBannerTarget)    applyLR(this.bannerTarget)
    if (this.hasPiecesTarget)    applyLR(this.piecesTarget)
    if (this.hasMembersTarget)   applyLR(this.membersTarget)
    if (this.hasGalleriesTarget) applyLR(this.galleriesTarget)
    if (this.hasVideosTarget)    applyLR(this.videosTarget)
  }

}
