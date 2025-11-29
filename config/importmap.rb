pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"

# 🔽 Ajoute ces deux lignes :
pin "controllers", to: "controllers/index.js"
pin "controllers/application", to: "controllers/application.js"

# 🔽 et garde ceci pour les controllers individuels :
pin_all_from "app/javascript/controllers", under: "controllers"

pin "bootstrap", to: "bootstrap.min.js", preload: true
pin "@popperjs/core", to: "popper.js", preload: true
