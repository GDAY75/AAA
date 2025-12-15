// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "@popperjs/core"
import "bootstrap"
import { Turbo } from "@hotwired/turbo-rails"

// ✅ Empêche Turbo de restaurer le scroll automatiquement
Turbo.session.history.scrollRestoration = "manual"


function pauseAllVideos() {
  document.querySelectorAll("video").forEach(v => {
    try {
      v.pause()
      // coupe la source pour Safari/iOS (sinon l’audio peut persister)
      v.removeAttribute("src")
      while (v.firstChild) v.removeChild(v.firstChild)
      v.load()
    } catch (e) {}
  })
}

// Avant mise en cache du DOM courant
document.addEventListener("turbo:before-cache", pauseAllVideos)
// Juste avant rendu d’une nouvelle page
document.addEventListener("turbo:before-render", pauseAllVideos)
// Au moment où l’on part vers une autre URL
document.addEventListener("turbo:visit", pauseAllVideos)
// Pour certains navigateurs / historiques
window.addEventListener("pagehide", pauseAllVideos)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") pauseAllVideos()
})

function hardCloseVideoModal() {
  document.querySelectorAll(".video-modal").forEach(modal => {
    modal.classList.remove("is-open");
  });
}

document.addEventListener("turbo:before-cache", hardCloseVideoModal);
document.addEventListener("turbo:before-render", hardCloseVideoModal);
document.addEventListener("turbo:visit", hardCloseVideoModal);

function forceCloseVideoModal() {
  document.querySelectorAll(".video-modal").forEach(modal => {
    modal.classList.remove("is-open");
    // Au cas où un player existe encore, on purge.
    const content = modal.querySelector(".video-modal__content");
    if (content) {
      content.querySelectorAll("video").forEach(v => {
        try {
          v.pause();
          v.removeAttribute("src");
          while (v.firstChild) v.removeChild(v.firstChild);
          v.load();
        } catch {}
        v.remove();
      });
    }
  });
}

document.addEventListener("turbo:before-cache", forceCloseVideoModal);
document.addEventListener("turbo:before-render", forceCloseVideoModal);
document.addEventListener("turbo:visit",        forceCloseVideoModal);

// ✅ Turbo doit contrôler la restauration du scroll
if (window.Turbo?.session?.history?.assumeControlOfScrollRestoration) {
  Turbo.session.history.assumeControlOfScrollRestoration()
} else if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"
}

const forceScrollTop = () => {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

// 1) Juste avant de partir vers une nouvelle page (le plus important)
document.addEventListener("turbo:before-visit", () => {
  forceScrollTop()
})

// 2) Après swap Turbo + paint
document.addEventListener("turbo:render", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      forceScrollTop()
      // 3) Certaines pages reflow après coup (images/fonts) -> petit filet de sécurité
      setTimeout(forceScrollTop, 50)
      setTimeout(forceScrollTop, 250)
    })
  })
})

// Si jamais tu as des navigations via turbo-frame quelque part
document.addEventListener("turbo:frame-load", () => {
  forceScrollTop()
})
