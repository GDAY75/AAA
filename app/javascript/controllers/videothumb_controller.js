import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["card", "wrap", "img", "src"]

  connect() {
    // Debug rapide
    // console.log("[videothumb] cards:", this.cardTargets.length)

    this.cardTargets.forEach(card => {
      const wrap = card.querySelector("[data-videothumb-target='wrap']")
      const img  = card.querySelector("[data-videothumb-target='img']")
      const src  = card.querySelector("[data-videothumb-target='src']")
      const url  = src?.dataset.src
      if (!wrap || !img || !url) return

      // Génère l'aperçu
      this.generatePreview(url, img).then(ok => {
        // Branche le clic pour remplacer par la vraie vidéo
        wrap.addEventListener("click", () => this.replaceWithVideo(url, wrap))
      }).catch(() => {
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
      // Ne pas définir crossOrigin pour des assets mêmes origine (évite soucis Safari)
      video.src = url

      const onError = () => { cleanup(); reject(new Error("video error")) }
      const onLoadedMeta = async () => {
        // Positionne à ~0.5s (ou 0 si plus court)
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
        try { video.currentTime = t } catch { onSeeked() } // fallback si seek bloqué
      }

      const cleanup = () => {
        video.removeEventListener("error", onError)
        video.removeEventListener("loadedmetadata", onLoadedMeta)
      }

      video.addEventListener("error", onError, { once: true })
      video.addEventListener("loadedmetadata", onLoadedMeta, { once: true })
      // Astuce: forcer le décodage meta dans certains navigateurs
      video.load()
    })
  }

  replaceWithVideo(url, container) {
    const videoEl = document.createElement("video")
    videoEl.controls = true
    videoEl.autoplay = true         // démarrer de suite
    videoEl.muted = true            // autoplay friendly
    videoEl.playsInline = true
    videoEl.className = "video-player"
    const source = document.createElement("source")
    source.src = url
    source.type = this.contentTypeFrom(url)
    videoEl.appendChild(source)

    container.innerHTML = ""        // remplace la vignette
    container.appendChild(videoEl)
    // Lance la lecture (certaines plateformes l’exigent même avec autoplay)
    videoEl.play().catch(() => {})
  }

  contentTypeFrom(path) {
    if (path.endsWith(".mp4") || path.includes(".mp4?")) return "video/mp4"
    if (path.endsWith(".webm")|| path.includes(".webm?")) return "video/webm"
    if (path.endsWith(".ogg") || path.includes(".ogg?")) return "video/ogg"
    if (path.endsWith(".mov") || path.includes(".mov?")) return "video/quicktime"
    return "video/mp4"
  }
}
