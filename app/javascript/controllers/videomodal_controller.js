import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "content"]

  connect() {
    this.onKey = (e) => { if (e.key === "Escape") this.close() }
  }

  open(e) {
    e.preventDefault()
    const url = e.currentTarget.dataset.videoUrl
    if (!url) return

    this.clear()

    const video = document.createElement("video")
    video.className = "video-modal__player"
    video.controls = true
    video.autoplay = true
    video.muted = true
    video.playsInline = true
    video.preload = "metadata"

    const source = document.createElement("source")
    source.src = url
    source.type = this.contentTypeFrom(url)
    video.appendChild(source)

    this.contentTarget.appendChild(video)

    this.modalTarget.classList.add("is-open")
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", this.onKey)
  }

  close() {
    this.contentTarget.querySelectorAll("video").forEach(v => {
      try {
        v.pause()
        v.removeAttribute("src")
        while (v.firstChild) v.removeChild(v.firstChild)
        v.load()
      } catch {}
      v.remove()
    })
    this.modalTarget.classList.remove("is-open")
    document.body.style.overflow = ""
    document.removeEventListener("keydown", this.onKey)
  }

  clear() { this.contentTarget.innerHTML = "" }

  contentTypeFrom(path) {
    if (!path) return "video/mp4"
    if (path.endsWith(".mp4") || path.includes(".mp4?")) return "video/mp4"
    if (path.endsWith(".webm")|| path.includes(".webm?")) return "video/webm"
    if (path.endsWith(".ogg") || path.includes(".ogg?")) return "video/ogg"
    if (path.endsWith(".mov") || path.includes(".mov?")) return "video/quicktime"
    return "video/mp4"
  }
}

