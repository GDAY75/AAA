import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["wrap", "img", "src"]

  connect() {
    this.srcTargets.forEach((srcEl, i) => {
      const url = srcEl.dataset.src
      const imgEl = this.imgTargets[i]
      if (!url || !imgEl) return
      this.generatePoster(url, imgEl)
    })
  }

  async generatePoster(url, imgEl) {
    try {
      const video = document.createElement("video")
      video.src = url
      video.crossOrigin = "anonymous"
      video.muted = true
      video.playsInline = true
      await video.play().catch(() => {}) // permet le load sur certains navigateurs
      await this.whenCanPlay(video)

      // positionne à 0.5s (ou 10% de la durée si dispo)
      const t = isFinite(video.duration) && video.duration > 1 ? Math.min(1, video.duration * 0.1) : 0.5
      video.currentTime = t
      await this.whenSeeked(video)

      // dessine sur canvas
      const canvas = document.createElement("canvas")
      const w = video.videoWidth
      const h = video.videoHeight
      if (!w || !h) return
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext("2d")
      ctx.drawImage(video, 0, 0, w, h)

      // dataURL en jpg (qualité 0.8)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
      imgEl.src = dataUrl
    } catch (e) {
      // fallback si problème
      imgEl.replaceWith(this.fallback())
    }
  }

  whenCanPlay(video) {
    return new Promise(resolve => {
      if (video.readyState >= 2) return resolve()
      const on = () => { video.removeEventListener("canplay", on); resolve() }
      video.addEventListener("canplay", on, { once: true })
    })
  }

  whenSeeked(video) {
    return new Promise(resolve => {
      const on = () => { video.removeEventListener("seeked", on); resolve() }
      video.addEventListener("seeked", on, { once: true })
    })
  }

  fallback() {
    const div = document.createElement("div")
    div.className = "thumb-fallback"
    div.textContent = "Vidéo"
    return div
  }
}
