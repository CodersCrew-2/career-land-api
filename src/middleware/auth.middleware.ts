import { User } from "@/lib/database/models/user.models";
import { verifyToken } from "@/lib/utils/jwt";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

export async function authMiddleware(ctx: Context, next: Next) {
	try {
		let token: string | undefined;

		// First, try to get token from cookies
		const cookieToken = getCookie(ctx, "accessToken");
		if (cookieToken) {
			token = cookieToken;
		} else {
			// If not in cookies, check Authorization header
			const authHeader = ctx.req.header("Authorization");

			if (!authHeader || typeof authHeader !== "string") {
				return ctx.json(
					{
						success: false,
						error: "Authorization token is required (cookie or header)",
					},
					401,
				);
			}

			// Check if it's a Bearer token
			if (!authHeader.includes(" ")) {
				return ctx.json(
					{
						success: false,
						error:
							"Invalid authorization header format. Expected: Bearer <token>",
					},
					401,
				);
			}

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

			token = parts[1];
		}

		if (!token || !token.trim()) {
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
