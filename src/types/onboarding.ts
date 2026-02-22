import type { Context } from "hono";

export interface IOnboardingServiceParams {
  ctx: Context
  userId: number;
  sessionId?: string;
  query: string;
}