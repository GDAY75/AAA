import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.onKey = (e) => { if (e.key === "Escape") this.close() }
    this.onResize = () => this.applySizing() // recalcul sur resize
    this.modal = null
    this.videoEl = null
    this.frame = null
  }

  open(e) {
    e.preventDefault()
    const url = e.currentTarget?.dataset?.videoUrl
    if (!url) return

    // Ferme un overlay éventuel
    this.close()

    // Overlay plein écran
    this.modal = document.createElement("div")
    Object.assign(this.modal.style, {
      position: "fixed",
      inset: "0",
      zIndex: "99999",
      display: "grid",
      placeItems: "center",
      background: "rgba(0,0,0,0.85)",
    })
    // Fermer si on clique sur le fond (pas sur le contenu)
    this.modal.addEventListener("click", (ev) => { if (ev.target === this.modal) this.close() })

    // Cadre qui contiendra la vidéo (dimensionné dynamiquement)
    this.frame = document.createElement("div")
    Object.assign(this.frame.style, {
      display: "grid",
      placeItems: "center",
      maxWidth: "90vw",
      maxHeight: "90vh",
    })
    // Stop la propagation pour ne pas fermer en cliquant sur le lecteur
    this.frame.addEventListener("click", (ev) => ev.stopPropagation())

    // Lecteur vidéo
    this.videoEl = document.createElement("video")
    Object.assign(this.videoEl.style, {
      background: "#000",
      border: "1px solid rgba(255,215,0,0.25)",
      borderRadius: "12px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      objectFit: "contain",
      maxWidth: "90vw",
      maxHeight: "90vh",
    })
    this.videoEl.controls = true
    this.videoEl.autoplay = true
    this.videoEl.muted = true
    this.videoEl.playsInline = true
    this.videoEl.preload = "metadata"

    const source = document.createElement("source")
    source.src = url
    source.type = this.contentTypeFrom(url)
    this.videoEl.appendChild(source)

    // Quand les métadonnées sont prêtes, on dimensionne selon l’orientation
    this.videoEl.addEventListener("loadedmetadata", () => this.applySizing(), { once: true })

    // Bouton Close (Font Awesome)
    const closeBtn = document.createElement("button")
    closeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    Object.assign(closeBtn.style, {
      position: "fixed",
      top: "50px",
      right: "50px",
      color: "#ffd87a",
      textDecoration: "none",
      fontSize: "50px",
      lineHeight: "1",
      fontWeight: "900",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      zIndex: "100000",
    })
    closeBtn.addEventListener("click", () => this.close())

    this.frame.appendChild(this.videoEl)
    this.modal.appendChild(this.frame)
    this.modal.appendChild(closeBtn)
    document.body.appendChild(this.modal)

    document.body.style.overflow = "hidden"
    window.addEventListener("resize", this.onResize)
    document.addEventListener("keydown", this.onKey)
  }

  applySizing() {
    if (!this.videoEl || !this.frame) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const arViewport = vw / vh

    const w = this.videoEl.videoWidth || 16
    const h = this.videoEl.videoHeight || 9
    const arVideo = w / h

    // Reset styles dynamiques
    this.frame.style.width = ""
    this.frame.style.height = ""
    this.videoEl.style.width = ""
    this.videoEl.style.height = ""
    this.videoEl.style.maxWidth = "90vw"
    this.videoEl.style.maxHeight = "90vh"

    // Si la vidéo est plus "large" que le viewport → privilégier largeur (90vw)
    // Sinon → privilégier hauteur (90vh)
    if (arVideo >= arViewport) {
      // Vidéo horizontale (ou aussi large que le viewport)
      this.frame.style.width = "90vw"
      this.frame.style.height = "auto"
      this.videoEl.style.width = "100%"
      this.videoEl.style.height = "auto"
      // sécurité max
      this.videoEl.style.maxHeight = "90vh"
    } else {
      // Vidéo verticale (plus "haute" que le viewport)
      this.frame.style.height = "90vh"
      this.frame.style.width = "auto"
      this.videoEl.style.height = "100%"
      this.videoEl.style.width = "auto"
      // sécurité max
      this.videoEl.style.maxWidth = "90vw"
    }
  }

  close() {
    if (!this.modal) return
    // purge player
    try {
      this.modal.querySelectorAll("video").forEach(v => {
        v.pause()
        v.removeAttribute("src")
        while (v.firstChild) v.removeChild(v.firstChild)
        v.load()
      })
    } catch {}
    this.modal.remove()
    this.modal = null
    this.videoEl = null
    this.frame = null
    document.body.style.overflow = ""
    window.removeEventListener("resize", this.onResize)
    document.removeEventListener("keydown", this.onKey)
  }

  contentTypeFrom(path) {
    if (!path) return "video/mp4"
    if (path.endsWith(".mp4") || path.includes(".mp4?")) return "video/mp4"
    if (path.endsWith(".webm")|| path.includes(".webm?")) return "video/webm"
    if (path.endsWith(".ogg") || path.includes(".ogg?")) return "video/ogg"
    if (path.endsWith(".mov") || path.includes(".mov?")) return "video/quicktime"
    return "video/mp4"
  }
}
