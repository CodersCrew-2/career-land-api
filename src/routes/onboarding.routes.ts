import { OnboardingController } from "@/controller/onboarding.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Hono } from "hono";

const onboardingRouter = new Hono();

onboardingRouter.use(authMiddleware);

onboardingRouter.post("/", OnboardingController.onboarding);

export default onboardingRouter;
