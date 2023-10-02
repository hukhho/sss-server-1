import { RouteConfig } from "@medusajs/admin"
import { Sun, Moon } from "@medusajs/icons"

const CustomPage = () => {
  return (
    <div>
      This is my custom route
    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Custom Route",
    icon: Sun,
  },
}

export default CustomPage