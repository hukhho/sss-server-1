import { Router } from "express";
// import customRouteHandler from "./custom-route-handler";
import queryRouteHandler from "./query-route-handler";
import { wrapHandler } from "@medusajs/medusa";

// Initialize a custom router
const router = Router();

export function attachPaymentRoutes(paymentRouter: Router) {
  // Attach our router to a custom path on the store router
  paymentRouter.use("/vnpay", router);
  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(queryRouteHandler));
}
