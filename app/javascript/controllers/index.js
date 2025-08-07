import { Application } from "@hotwired/stimulus"
import SidebarController from "./sidebar_controller"

const application = Application.start()
application.register("sidebar", SidebarController)
