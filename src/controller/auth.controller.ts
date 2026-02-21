import { AuthService } from "@/services/auth.service";
import type { Context } from "hono";

export class AuthController {

	public static readonly getGoogleAuthUrl = async (ctx: Context) => {
		try {
			const { url } = AuthService.getAuthorizeUrI({ ctx });

			return ctx.json(
				{
					success: true,
					data: { url },
				},
				200,
			);
		} catch (error) {
			return ctx.json(
				{
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to generate authorization URL",
				},
				500,
			);
		}
	};

	public static readonly googleCallback = async (ctx: Context) => {
		try {
			const code = ctx.req.query("code");

			if (!code) {
				return ctx.json(
					{
						success: false,
						error: "Authorization code is required",
					},
					400,
				);
			}

			const result = await AuthService.getAccessToken({ ctx, code });

			return ctx.json(
				{
					success: true,
					data: result,
				},
				200,
			);
		} catch (error) {
			return ctx.json(
				{
					success: false,
					error:
						error instanceof Error ? error.message : "Authentication failed",
				},
				401,
			);
		}
	};


	public static readonly getCurrentUser = async (ctx: Context) => {
		try {
			const user = ctx.get("user");

			if (!user) {
				return ctx.json(
					{
						success: false,
						error: "Not authenticated",
					},
					401,
				);
			}

			return ctx.json(
				{
					success: true,
					data: { user },
				},
				200,
			);
		} catch (error) {
			return ctx.json(
				{
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch user data",
				},
				500,
			);
		}
	};


	public static readonly logout = async (ctx: Context) => {
		try {
			// Client should remove the token from storage
			return ctx.json(
				{
					success: true,
					message: "Logged out successfully",
				},
				200,
			);
		} catch (error) {
			return ctx.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Logout failed",
				},
				500,
			);
		}
	};
}
