import { Application } from "@hotwired/stimulus"

import SidebarController from "./sidebar_controller.js"
import LightboxController from "./lightbox_controller.js"
import MasonryController from "./masonry_controller.js"
import VideothumbController from "./videothumb_controller.js"
import VideomodalController from "./videomodal_controller.js"
import GalcoverController from "./galcover_controller.js"

const application = Application.start()

application.register("sidebar", SidebarController)
application.register("lightbox", LightboxController)
application.register("masonry", MasonryController)
application.register("videothumb", VideothumbController)
application.register("videomodal", VideomodalController)
application.register("galcover", GalcoverController)

