// app/javascript/controllers/masonry_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["source", "grid"]

  connect() {
    // Récupère les items (liens .photo-tile)
    this.items = Array.from(this.sourceTarget.querySelectorAll("[data-masonry-item]"))

    // Recalc au resize (debounce)
    this.onResize = this.debounce(() => this.layout(), 120)
    window.addEventListener("resize", this.onResize)

    // Relayout si une image charge après coup
    this.items.forEach(link => {
      const img = link.querySelector("img")
      if (!img) return
      img.addEventListener("load", () => this.layout(), { passive: true })
    })

    this.layout()
  }

  disconnect() {
    window.removeEventListener("resize", this.onResize)
  }

  columnCount() {
    const w = window.innerWidth
    if (w <= 520)  return 1
    if (w <= 900)  return 2
    if (w <= 1280) return 3
    return 4
  }

  async layout() {
    const cols = this.columnCount()
    if (!cols || cols < 1) return

    // Attends que les images aient au moins une dimension
    await this.waitForImages()

    // Reset grille
    this.gridTarget.innerHTML = ""
    this.gridTarget.style.display = "flex"

    // Crée les colonnes + état des hauteurs
    const colEls = []
    const colHeights = new Array(cols).fill(0)

    for (let i = 0; i < cols; i++) {
      const col = document.createElement("div")
      col.className = "masonry-col"
      this.gridTarget.appendChild(col)
      colEls.push(col)
    }

    // Place chaque item dans la colonne la plus courte
    for (const item of this.items) {
      const shortestIndex = this.indexOfMin(colHeights)
      colEls[shortestIndex].appendChild(item)

      // Force reflow pour obtenir la hauteur (inclut bords/ombres)
      const h = item.getBoundingClientRect().height
      // Ajoute l’espace vertical (gap) – doit matcher ton SCSS (14px)
      colHeights[shortestIndex] += h + 14
    }

    // Masque la source
    this.sourceTarget.style.display = "none"
  }

  indexOfMin(arr) {
    let idx = 0, min = arr[0]
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < min) { min = arr[i]; idx = i }
    }
    return idx
  }

  waitForImages() {
    const imgs = this.items.map(el => el.querySelector("img")).filter(Boolean)
    const tasks = imgs.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise(res => img.addEventListener("load", () => res(), { once: true }))
    })
    return Promise.all(tasks)
  }

  debounce(fn, delay = 100) {
    let t
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), delay) }
  }
}

