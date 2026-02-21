import { Hono } from "hono";
import authRoutes from "./auth.routes";

const apiRoutes = new Hono();

apiRoutes.get("/health", (ctx) => {
  return ctx.json(
    { success: true, message: "API is healthy" },
    200,
  );
});

apiRoutes.route("/auth",authRoutes)

export default apiRoutes;