import { OnboardingService } from "@/services/onboarding.service";
import type { Context } from "hono";

export class OnboardingController {
	public static readonly onboarding = async (ctx: Context) => {
		try {
			const body = await ctx.req.json();
			const { query, sessionId } = body;

			if (!query) {
				return ctx.json(
					{
						success: false,
						error: "Query is required",
					},
					400,
				);
			}

			// Convert query object to string if needed
			let queryString: string;
			if (typeof query === "string") {
				queryString = query;
			} else if (typeof query === "object" && query !== null) {
				// Convert any object structure to natural language
				const parts = Object.entries(query).map(([key, value]) => {
					const formattedKey = key.replace(/_/g, " ");
					return `${formattedKey}: ${value}`;
				});
				queryString = parts.join(", ");
			} else {
				return ctx.json(
					{
						success: false,
						error: "Query must be a string or object",
					},
					400,
				);
			}

			// Get authenticated user from context
			const user = ctx.get("user");

			if (!user || !user.id) {
				return ctx.json(
					{
						success: false,
						error: "User authentication required",
					},
					401,
				);
			}

			const result = await OnboardingService.onboarding({
				ctx,
				userId: user.id,
				sessionId,
				query: queryString,
			});

			return ctx.json(
				{
					success: true,
					data: result,
				},
				200,
			);
		} catch (error) {
			console.error("Error in onboarding controller:", error);
			return ctx.json(
				{
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to process onboarding request",
				},
				500,
			);
		}
	};
}
