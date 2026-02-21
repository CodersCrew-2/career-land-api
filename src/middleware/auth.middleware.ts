import { User } from "@/lib/database/models/user.models";
import { verifyToken } from "@/lib/utils/jwt";
import type { Context, Next } from "hono";

export async function authMiddleware(ctx: Context, next: Next) {
	try {
		// Get token from Authorization header
		const authHeader = ctx.req.header("Authorization");

		if (!authHeader) {
			return ctx.json(
				{
					success: false,
					error: "Authorization header is required",
				},
				401,
			);
		}

		// Check if it's a Bearer token
		const parts = authHeader.split(" ");
		if (parts.length !== 2 || parts[0] !== "Bearer") {
			return ctx.json(
				{
					success: false,
					error:
						"Invalid authorization header format. Expected: Bearer <token>",
				},
				401,
			);
		}

		const token = parts[1];
    if (!token) {
      return ctx.json(
        {
          success: false,
          error: "Token is required",
        },
        401,
      );
    }

		const payload = await verifyToken({ token, ctx });

		if (!payload) {
			return ctx.json(
				{
					success: false,
					error: "Invalid or expired token",
				},
				401,
			);
		}

		// Fetch user from database
		const user = await User.findById(payload.id);

		if (!user) {
			return ctx.json(
				{
					success: false,
					error: "User not found",
				},
				404,
			);
		}

		ctx.set("user", {
			id: user._id.toString(),
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		});

		await next();
	} catch (error) {
		console.error("Auth middleware error:", error);
		return ctx.json(
			{
				success: false,
				error: "Authentication failed",
			},
			500,
		);
	}
}