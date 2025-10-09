import { Application } from "@hotwired/stimulus"
import SidebarController from "./sidebar_controller"
import LightboxController from "./lightbox_controller"

const application = Application.start()
application.register("sidebar", SidebarController)
application.register("lightbox", LightboxController)
