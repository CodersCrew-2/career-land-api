import { Hono } from "hono";
import authRoutes from "./auth.routes";
import onboardingRoutes from "./onboarding.routes";

const apiRoutes = new Hono();

apiRoutes.get("/health", (ctx) => {
	return ctx.json({ success: true, message: "API is healthy" }, 200);
});

apiRoutes.route("/auth", authRoutes);
apiRoutes.route("/onboarding", onboardingRoutes);

export default apiRoutes;
