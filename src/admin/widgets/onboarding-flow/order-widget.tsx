import type { 
    OrderDetailsWidgetProps,
    WidgetConfig,
  } from "@medusajs/admin"
import { Button } from "@medusajs/ui"
  
  const OrderWidget = ({ order }: OrderDetailsWidgetProps) => {
    
    return (
      <div 
        className="bg-white p-8 border border-gray-200 rounded-lg">
        <p>{order.id}</p>
        <Button>
            Add coin to seller
        </Button>
      </div>
    )
  }
  
  export const config: WidgetConfig = {
    zone: "order.details.after",
  }
  
  export default OrderWidget