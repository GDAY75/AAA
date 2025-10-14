import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "image", "caption", "thumb", "viewport"]

  connect() {
    // dataset from thumbs (déjà présent chez toi)
    this.items = this.thumbTargets?.map(el => ({
      url: el.dataset.imageUrl,
      caption: el.dataset.caption || ""
    })) || []

    // état zoom/pan
    this.minScale = 1
    this.maxScale = 4
    this.scale = 1
    this.tx = 0
    this.ty = 0

    // flags pour le pan/clic
    this.isPanning = false
    this.panMoved = false         // ✅ a-t-on bougé ?
    this.panThreshold = 4         // ✅ px avant de considérer que c’est un drag
  }

  // ----- ouverture / navigation (existant chez toi) -----
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
    this.zoomReset()
  }
  next() { if (!this.items.length) return; this.current = (this.current + 1) % this.items.length; this.show(this.current, true) }
  prev() { if (!this.items.length) return; this.current = (this.current - 1 + this.items.length) % this.items.length; this.show(this.current, true) }
  show(index, keepZoom = false) {
    const it = this.items[index]; if (!it) return
    this.imageTarget.src = it.url
    this.imageTarget.alt = it.caption || "Photo"
    this.captionTarget.textContent = it.caption || ""
    if (!keepZoom) this.zoomReset()
  }

  // ----- ZOOM -----
  zoomIn()  { this.setScale(this.scale * 1.25) }
  zoomOut() { this.setScale(this.scale / 1.25) }
  zoomReset() {
    this.scale = 1; this.tx = 0; this.ty = 0; this.applyTransform()
  }
  toggleZoom(e) {
  // ✅ si on vient de panner, on neutralise ce clic “up”
    if (this.panMoved) {
      this.panMoved = false
      e.preventDefault()
      return
    }

    if (this.scale === 1) {
      this.zoomAtPoint(2, e)
    } else {
      this.zoomReset()
    }
  }


  wheelZoom(e) {
    e.preventDefault()
    const delta = Math.sign(e.deltaY) * -0.2 // molette vers l’avant = zoom in
    const targetScale = this.scale * (1 + delta)
    this.zoomAtPoint(targetScale, e)
  }

  zoomAtPoint(targetScale, evt) {
    // clamp
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, targetScale))
    const rect = this.viewportTarget.getBoundingClientRect()
    const cx = (evt.clientX ?? (rect.left + rect.width/2)) - rect.left
    const cy = (evt.clientY ?? (rect.top  + rect.height/2)) - rect.top

    // ajuster la translation pour zoomer autour du point (cx, cy)
    const scaleRatio = newScale / this.scale
    this.tx = (this.tx - cx) * scaleRatio + cx
    this.ty = (this.ty - cy) * scaleRatio + cy

    this.scale = newScale
    this.constrain()
    this.applyTransform()
  }

  setScale(newScale) {
    this.scale = Math.max(this.minScale, Math.min(this.maxScale, newScale))
    this.constrain()
    this.applyTransform()
  }

  applyTransform() {
    this.imageTarget.style.transform = `translate(${this.tx}px, ${this.ty}px) scale(${this.scale})`
  }

  constrain() {
    // Empêche de sortir trop du viewport
    const rectV = this.viewportTarget.getBoundingClientRect()
    const rectI = this.imageTarget.getBoundingClientRect()

    // Dimensions intrinsèques de l’image à l’échelle 1
    const naturalW = this.imageTarget.naturalWidth || rectI.width / this.scale
    const naturalH = this.imageTarget.naturalHeight || rectI.height / this.scale

    // Taille rendue à l’échelle actuelle mais sans translation (approx pour bornes)
    const renderedW = naturalW * (rectV.width / naturalW) * this.scale
    const renderedH = naturalH * (rectV.width / naturalW) * this.scale
    // On peut utiliser rectI.width/height, mais recalcul simple :
    const halfW = (this.imageTarget.clientWidth  * this.scale) / 2
    const halfH = (this.imageTarget.clientHeight * this.scale) / 2

    const boundX = Math.max(0, halfW - rectV.width / 2)
    const boundY = Math.max(0, halfH - rectV.height / 2)

    // Clamp tx/ty
    this.tx = Math.max(-boundX, Math.min(boundX, this.tx))
    this.ty = Math.max(-boundY, Math.min(boundY, this.ty))
  }

  // ----- PAN (drag) -----
  panStart(e) {
    if (this.scale === 1) return
    e.preventDefault()
    this.isPanning = true
    this.panMoved = false                   // ✅ reset
    this.viewportTarget.classList.add("is-panning")
    this.startX = e.clientX - this.tx
    this.startY = e.clientY - this.ty
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  panMove(e) {
    if (!this.isPanning) return
    e.preventDefault()
    const newTx = e.clientX - this.startX
    const newTy = e.clientY - this.startY
    // ✅ détecte un vrai déplacement
    if (!this.panMoved) {
      const dx = newTx - this.tx, dy = newTy - this.ty
      if (Math.hypot(dx, dy) >= this.panThreshold) this.panMoved = true
    }
    this.tx = newTx
    this.ty = newTy
    this.constrain()
    this.applyTransform()
  }

  panEnd(e) {
    if (!this.isPanning) return
    this.isPanning = false
    this.viewportTarget.classList.remove("is-panning")
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
    // ✅ on laisse panMoved à true si on a réellement bougé
  }


}
