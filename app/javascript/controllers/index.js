// app/javascript/controllers/index.js
import { application } from "controllers/application"

import SidebarController from "controllers/sidebar_controller"
import LightboxController from "controllers/lightbox_controller"
import MasonryController from "controllers/masonry_controller"
import VideothumbController from "controllers/videothumb_controller"
import VideomodalController from "controllers/videomodal_controller"
import GalcoverController from "controllers/galcover_controller"

// On enregistre les contrôleurs Stimulus
application.register("sidebar", SidebarController)
application.register("lightbox", LightboxController)
application.register("masonry", MasonryController)
application.register("videothumb", VideothumbController)
application.register("videomodal", VideomodalController)
application.register("galcover", GalcoverController)
