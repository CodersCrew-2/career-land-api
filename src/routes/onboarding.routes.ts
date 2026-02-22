import { OnboardingController } from "@/controller/onboarding.controller";
import { Hono } from "hono";

const onboardingRouter = new Hono();

onboardingRouter.post("/", OnboardingController.onboarding);

export default onboardingRouter;
