import { getUserCollection } from "@/lib/database/models/user.models";
import { verifyToken } from "@/lib/utils/jwt";
import type { Context, Next } from "hono";
import { ObjectId } from "mongodb";
import type { Db } from "mongodb";

export async function authMiddleware(ctx: Context, next: Next) {
	try {
		const authHeader = ctx.req.header("Authorization");

		if (!authHeader || typeof authHeader !== "string") {
			return ctx.json(
				{
					success: false,
					error: "Authorization header is required",
				},
				401,
			);
		}

		// Check if it's a Bearer token
		if (!authHeader.startsWith("Bearer ")) {
			return ctx.json(
				{
					success: false,
					error:
						"Invalid authorization header format. Expected: Bearer <token>",
				},
				401,
			);
		}

		const token = authHeader.substring(7); // Remove 'Bearer '

		if (!token.trim()) {
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
		const db = ctx.get("db") as Db;
		const usersCol = getUserCollection(db);
		const user = await usersCol.findOne({
			_id: new ObjectId(payload.id),
		});

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
			id: user._id!.toString(),
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
