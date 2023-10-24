import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import onboardingRoutes from "./onboarding";
import customRouteHandler from "./custom-route-handler";
import testRouteHandler from "./test-route-handler";
import createDepositHandler from "./create-deposit-handler";
import getDepositHandler from "./get-deposit-handler";

// Initialize a custom router
const router = Router();

export function attachAdminRoutes(adminRouter: Router) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/custom", router);

  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(customRouteHandler));
  router.get("/test", wrapHandler(testRouteHandler));

  router.get("/deposits", wrapHandler(getDepositHandler));
  router.post("/deposit", wrapHandler(createDepositHandler));

  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter);
}
