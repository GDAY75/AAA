// app/javascript/controllers/videothumb_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["card", "img", "src"]

  connect() {
    this.srcTargets.forEach((srcEl, i) => {
      const videoPath = srcEl.dataset.src
      const imgEl = this.imgTargets[i]
      if (!videoPath || !imgEl) return
      this.generatePreview(videoPath, imgEl)
    })
  }

  async generatePreview(url, imgEl) {
    try {
      const video = document.createElement("video")
      video.src = url
      video.muted = true
      video.crossOrigin = "anonymous"
      await video.play().catch(() => {})
      await this.waitFor(video, "canplay")

      video.currentTime = 0.5
      await this.waitFor(video, "seeked")

      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
      imgEl.src = dataUrl

      // ajout clic pour lire la vraie vidéo
      imgEl.closest(".thumb-wrap").addEventListener("click", () => {
        this.replaceWithVideo(url, imgEl.closest(".thumb-wrap"))
      })
    } catch (err) {
      console.warn("Prévisualisation vidéo impossible :", err)
      imgEl.alt = "Prévisualisation indisponible"
    }
  }

  waitFor(video, event) {
    return new Promise(resolve => video.addEventListener(event, resolve, { once: true }))
  }

  replaceWithVideo(url, container) {
    const videoEl = document.createElement("video")
    videoEl.src = url
    videoEl.controls = true
    videoEl.autoplay = true
    videoEl.playsInline = true
    videoEl.classList.add("video-player")
    container.innerHTML = ""
    container.appendChild(videoEl)
  }
}
