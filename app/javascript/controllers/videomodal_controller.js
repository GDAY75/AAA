import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.onKey = (e) => { if (e.key === "Escape") this.close() }
  }

  open(e) {
    e.preventDefault()
    const url = e.currentTarget?.dataset?.videoUrl
    if (!url) return
    this.close() // au cas où

    // Crée le conteneur overlay
    this.modal = document.createElement("div")
    Object.assign(this.modal.style, {
      position: "fixed", inset: "0", zIndex: "99999",
      background: "rgba(0,0,0,0.85)", display: "grid", placeItems: "center"
    })
    this.modal.className = "video-overlay"

    // Fermer sur clic hors player
    this.modal.addEventListener("click", (ev) => {
      if (ev.target === this.modal) this.close()
    })

    // Bouton close (icône Font Awesome dorée)
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
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
      zIndex: "10001",
      transition: "color 0.3s ease"
    });

    // Hover rouge comme les autres boutons du site
    closeBtn.addEventListener("mouseenter", () => (closeBtn.style.color = "red"));
    closeBtn.addEventListener("mouseleave", () => (closeBtn.style.color = "#ffd87a"));

    // Action de fermeture
    closeBtn.addEventListener("click", () => this.close());

    // Ajout dans la modale
    this.modal.appendChild(closeBtn);

    // Contenu centré
    const content = document.createElement("div")
    Object.assign(content.style, {
      maxWidth: "92vw", maxHeight: "90vh", width: "100%", display: "grid", placeItems: "center"
    })

    // Lecteur vidéo
    const video = document.createElement("video")
    Object.assign(video.style, {
      maxWidth: "100%", maxHeight: "90vh", background: "#000",
      border: "1px solid rgba(255,215,0,0.25)", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
    })
    video.controls = true
    video.autoplay = true
    video.muted = true
    video.playsInline = true
    video.preload = "metadata"

    const source = document.createElement("source")
    source.src = url
    source.type = this.contentTypeFrom(url)
    video.appendChild(source)

    content.appendChild(video)
    this.modal.appendChild(content)
    document.body.appendChild(this.modal)

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", this.onKey)
  }

  close() {
    if (!this.modal) return
    // purge player
    this.modal.querySelectorAll("video").forEach(v => {
      try { v.pause(); v.removeAttribute("src"); while (v.firstChild) v.removeChild(v.firstChild); v.load() } catch {}
    })
    this.modal.remove()
    this.modal = null
    document.body.style.overflow = ""
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
