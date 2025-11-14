import { Application } from "@hotwired/stimulus"
import SidebarController from "./sidebar_controller"
import LightboxController from "./lightbox_controller"
import MasonryController from "./masonry_controller"
import VideothumbController from "./videothumb_controller"
import VideomodalController from "./videomodal_controller"
import GalcoverController from "./galcover_controller"

const application = Application.start()
application.register("sidebar", SidebarController)
application.register("lightbox", LightboxController)
application.register("masonry", MasonryController)
application.register("videothumb", VideothumbController)
application.register("videomodal", VideomodalController)
application.register("galcover", GalcoverController)
