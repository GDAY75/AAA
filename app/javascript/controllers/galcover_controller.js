import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["stack"]
  static values = {
    interval: { type: Number, default: 2400 },
    autoplay: { type: Boolean, default: true }
  }

  connect() {
    this.slides = Array.from(this.element.querySelectorAll(".gal-slide"))
    this.shuffleSlides() // 🌀 mélange aléatoire au chargement
    this.index = 0
    this.timer = null

    if (this.slides.length > 1 && this.autoplayValue) {
      this.play()
    }

    this._onEnter = () => this.pause()
    this._onLeave = () => this.play()
    this.element.addEventListener("mouseenter", this._onEnter)
    this.element.addEventListener("mouseleave", this._onLeave)
    this.element.addEventListener("focusin", this._onEnter)
    this.element.addEventListener("focusout", this._onLeave)

    this._onBeforeCache = () => this.pause()
    document.addEventListener("turbo:before-cache", this._onBeforeCache)
  }

  disconnect() {
    this.pause()
    this.element.removeEventListener("mouseenter", this._onEnter)
    this.element.removeEventListener("mouseleave", this._onLeave)
    this.element.removeEventListener("focusin", this._onEnter)
    this.element.removeEventListener("focusout", this._onLeave)
    document.removeEventListener("turbo:before-cache", this._onBeforeCache)
  }

  // 🌀 Mélange aléatoire de slides (algorithme de Fisher–Yates)
  shuffleSlides() {
    if (!this.slides?.length) return
    for (let i = this.slides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.slides[i], this.slides[j]] = [this.slides[j], this.slides[i]]
    }

    // Réordonne dans le DOM selon le nouvel ordre
    const stack = this.element.querySelector("[data-galcover-target='stack']")
    stack.innerHTML = ""
    this.slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === 0)
      stack.appendChild(slide)
    })
  }

  play() {
    this.pause()
    this.timer = setInterval(() => this.next(), this.intervalValue)
  }

  pause() {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
  }

  next() {
    if (!this.slides?.length) return
    const current = this.slides[this.index]
    this.index = (this.index + 1) % this.slides.length
    const next = this.slides[this.index]
    this.fadeTo(current, next)
  }

  fadeTo(from, to) {
    if (!from || !to || from === to) return
    from.classList.remove("is-active")
    to.classList.add("is-active")

    // précharge la suivante
    const nextIdx = (this.index + 1) % this.slides.length
    const preload = this.slides[nextIdx]
    if (preload && preload.dataset.preloaded !== "1" && preload.tagName === "IMG") {
      const img = new Image()
      img.src = preload.src
      preload.dataset.preloaded = "1"
    }
  }
}
