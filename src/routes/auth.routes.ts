import { AuthController } from "@/controller/auth.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Hono } from "hono";

const authRoutes = new Hono();

authRoutes.get("/google", AuthController.getGoogleAuthUrl);
authRoutes.get("/google/callback", AuthController.googleCallback);
authRoutes.get("/me", authMiddleware, AuthController.getCurrentUser);
authRoutes.post("/logout", authMiddleware, AuthController.logout);

export default authRoutes;