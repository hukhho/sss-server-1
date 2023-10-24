import { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {  ConfigModule, authenticate } from "@medusajs/medusa";
import { getConfigFile } from "medusa-core-utils";
import { attachStoreRoutes } from "./routes/store";
import { attachAdminRoutes } from "./routes/admin";
import { attachPaymentRoutes } from "./routes/payment";

import { registerLoggedInUser } from "./middlewares/logged-in-user";
import { registerLoggedInCustomer } from "./middlewares/logged-in-customer";

// import authenticate from "./middlewares/authenticate";
export default (rootDirectory: string): Router | Router[] => {
  // Read currently-loaded medusa config
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );
  
  const { projectConfig } = configModule;
  // Set up our CORS options objects, based on config
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };

  const customCorsOptions = {
    origin: projectConfig.admin_cors.split(",").concat(projectConfig.store_cors.split(",")),
    credentials: true,
  };
  // Set up express router
  const router = Router();

  // Set up root routes for store and admin endpoints, with appropriate CORS settings
  router.use("/payment", cors(customCorsOptions), bodyParser.json());
  router.use("/store", cors(customCorsOptions), bodyParser.json());
  router.use("/admin", cors(customCorsOptions), bodyParser.json());
  router.use("/admin/custom", cors(customCorsOptions), bodyParser.json());

  // Add authentication to all admin routes *except* auth and account invite ones
  router.use(
    /\/admin\/((?!custom)(?!auth)(?!invites)(?!users\/reset-password)(?!users\/password-token).*)/,
    authenticate(),
    registerLoggedInUser,
  );
  router.use('/admin/custom/test', registerLoggedInCustomer);
  
  router.use('/admin/custom/deposit', authenticate(), registerLoggedInUser);
  router.use('/admin/custom/deposits', authenticate(), registerLoggedInUser);

  // Set up routers for store and admin endpoints
  const paymentRouter = Router();
  const storeRouter = Router();
  const adminRouter = Router();

  // Attach these routers to the root routes
  router.use("/payment", paymentRouter);
  router.use("/store", storeRouter);
  router.use("/admin", adminRouter);

  // Attach custom routes to these routers
  attachPaymentRoutes(paymentRouter);
  attachStoreRoutes(storeRouter);
  attachAdminRoutes(adminRouter);

  return router;
};
