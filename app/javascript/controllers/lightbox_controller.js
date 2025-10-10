import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "image", "caption", "thumb"]

  connect() {
    // Construit la liste des items (url + caption) depuis les thumbs
    this.items = this.thumbTargets.map((el) => ({
      url: el.dataset.imageUrl,
      caption: el.dataset.caption || ""
    }))
    this.current = 0
  }

  open(e) {
    e.preventDefault()
    const link = e.currentTarget
    this.current = parseInt(link.dataset.index || "0", 10)
    this.show(this.current)
    this.modalTarget.classList.add("is-open")
    document.body.style.overflow = "hidden"
  }

  close(e) {
    e.preventDefault()
    this.modalTarget.classList.remove("is-open")
    this.imageTarget.src = ""
    document.body.style.overflow = ""
  }

  next() {
    if (!this.items?.length) return
    this.current = (this.current + 1) % this.items.length
    this.show(this.current)
  }

  prev() {
    if (!this.items?.length) return
    this.current = (this.current - 1 + this.items.length) % this.items.length
    this.show(this.current)
  }

  show(index) {
    const item = this.items[index]
    if (!item) return
    this.imageTarget.src = item.url
    this.imageTarget.alt = item.caption || "Photo"
    this.captionTarget.textContent = item.caption || ""
  }
}

