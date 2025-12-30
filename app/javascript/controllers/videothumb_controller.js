import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["card", "img", "src"]

  connect() {
    this._queue = []
    this._running = 0
    this._maxConcurrency = 2
    this._seen = new WeakSet()

    // Observe uniquement en mobile/slow devices si tu veux
    this._io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const card = entry.target
        this._io.unobserve(card)
        this.enqueueCard(card)
      })
    }, { root: null, rootMargin: "200px 0px", threshold: 0.01 })

    this.cardTargets.forEach(card => this._io.observe(card))
  }

  disconnect() {
    if (this._io) this._io.disconnect()
    this._queue = []
  }

  enqueueCard(card) {
    if (this._seen.has(card)) return
    this._seen.add(card)

    const img = card.querySelector("[data-videothumb-target='img']")
    const src = card.querySelector("[data-videothumb-target='src']")
    const url = src?.dataset.src
    if (!img || !url) return

    // déjà généré ?
    if (img.dataset.thumbReady === "1") return

    this._queue.push({ url, img })
    this.pump()
  }

  pump() {
    while (this._running < this._maxConcurrency && this._queue.length) {
      const job = this._queue.shift()
      this._running++
      this.generatePreview(job.url, job.img)
        .then(() => { job.img.dataset.thumbReady = "1" })
        .catch(() => { job.img.alt = "Prévisualisation indisponible" })
        .finally(() => {
          this._running--
          this.pump()
        })
    }
  }

  generatePreview(url, imgEl) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")

      // Important mobile
      video.preload = "auto"
      video.muted = true
      video.playsInline = true
      video.setAttribute("playsinline", "")
      video.setAttribute("webkit-playsinline", "")

      // ✅ si la vidéo est cross-domain, il faut aussi que le serveur autorise CORS
      video.crossOrigin = "anonymous"

      video.src = url

      let done = false
      const finish = (ok, err) => {
        if (done) return
        done = true
        cleanup()
        ok ? resolve(true) : reject(err || new Error("thumb fail"))
      }

      const cleanup = () => {
        clearTimeout(timer)
        video.removeEventListener("error", onError)
        video.removeEventListener("loadeddata", onLoadedData)
        video.removeEventListener("seeked", onSeeked)
        try {
          video.pause()
          video.removeAttribute("src")
          video.load()
        } catch {}
      }

      const onError = () => finish(false, new Error("video error"))

      const onLoadedData = () => {
        // on peut decoder une frame
        const t = (isFinite(video.duration) && video.duration > 0.6) ? 0.5 : 0
        try {
          video.currentTime = t
        } catch {
          // certains navigateurs refusent le seek => on tente quand même
          onSeeked()
        }
      }

      const onSeeked = () => {
        try {
          const w = video.videoWidth, h = video.videoHeight
          if (!w || !h) throw new Error("no dimensions")

          const canvas = document.createElement("canvas")
          canvas.width = w
          canvas.height = h

          const ctx = canvas.getContext("2d")
          ctx.drawImage(video, 0, 0, w, h)

          imgEl.src = canvas.toDataURL("image/jpeg", 0.85)
          finish(true)
        } catch (e) {
          // si CORS bloque, ça finit souvent ici
          finish(false, e)
        }
      }

      // timeout sécurité (mobile peut rester bloqué)
      const timer = setTimeout(() => finish(false, new Error("timeout")), 4000)

      video.addEventListener("error", onError, { once: true })
      video.addEventListener("loadeddata", onLoadedData, { once: true })
      video.addEventListener("seeked", onSeeked)

      video.load()
    })
  }
}

