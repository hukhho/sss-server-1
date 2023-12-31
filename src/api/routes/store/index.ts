import { Router } from "express";
import customRouteHandler from "./custom-route-handler";
import testRouteHandler from "./test-route-handler";
import test1RouteHandler from "./test1-route-handler";
import createDepositHandler from "./create-deposit-handler";
import { wrapHandler } from "@medusajs/medusa";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/custom", router);
 
  // Define a GET endpoint on the root route of our custom path
  router.get("/vnpay", wrapHandler(customRouteHandler));
  router.get("/test", wrapHandler(testRouteHandler));
  
  router.post("/deposit", wrapHandler(createDepositHandler));

  router.post("/register", wrapHandler(test1RouteHandler));

}
