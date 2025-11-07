import { Controller } from "@hotwired/stimulus"

// Génère juste une image d'aperçu depuis la vidéo.
// ⛔ Aucun listener de clic ici (l’overlay s’occupe du clic).
export default class extends Controller {
  static targets = ["card", "wrap", "img", "src"]

  connect() {
    this.cardTargets.forEach(card => {
      const img = card.querySelector("[data-videothumb-target='img']")
      const src = card.querySelector("[data-videothumb-target='src']")
      const url = src?.dataset.src
      if (!img || !url) return
      this.generatePreview(url, img).catch(() => {
        img.alt = "Prévisualisation indisponible"
      })
    })
  }

  async generatePreview(url, imgEl) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.muted = true
      video.playsInline = true
      video.src = url

      const onError = () => { cleanup(); reject(new Error("video error")) }
      const onLoadedMeta = () => {
        const t = isFinite(video.duration) && video.duration > 0.6 ? 0.5 : 0
        const onSeeked = () => {
          try {
            const w = video.videoWidth, h = video.videoHeight
            if (!w || !h) throw new Error("no dimensions")
            const canvas = document.createElement("canvas")
            canvas.width = w; canvas.height = h
            const ctx = canvas.getContext("2d")
            ctx.drawImage(video, 0, 0, w, h)
            imgEl.src = canvas.toDataURL("image/jpeg", 0.85)
            cleanup(); resolve(true)
          } catch (e) { cleanup(); reject(e) }
        }
        video.addEventListener("seeked", onSeeked, { once: true })
        try { video.currentTime = t } catch { onSeeked() }
      }

      const cleanup = () => {
        video.removeEventListener("error", onError)
        video.removeEventListener("loadedmetadata", onLoadedMeta)
      }

      video.addEventListener("error", onError, { once: true })
      video.addEventListener("loadedmetadata", onLoadedMeta, { once: true })
      video.load()
    })
  }
}

