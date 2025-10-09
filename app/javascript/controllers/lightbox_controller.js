import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "image", "caption"]

  open(e) {
    e.preventDefault()
    const link = e.currentTarget
    const url = link.dataset.imageUrl
    const caption = link.dataset.caption || ""

    this.imageTarget.src = url
    this.imageTarget.alt = caption || "Photo"
    this.captionTarget.textContent = caption
    this.modalTarget.classList.add("is-open")
    document.body.style.overflow = "hidden" // bloque le scroll derrière
  }

  close(e) {
    e.preventDefault()
    this.modalTarget.classList.remove("is-open")
    this.imageTarget.src = ""
    document.body.style.overflow = ""
  }
}
