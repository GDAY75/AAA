import { Application } from "@hotwired/stimulus"
import SidebarController from "./sidebar_controller"
import LightboxController from "./lightbox_controller"
import MasonryController from "./masonry_controller"

const application = Application.start()
application.register("sidebar", SidebarController)
application.register("lightbox", LightboxController)
application.register("masonry", MasonryController)
