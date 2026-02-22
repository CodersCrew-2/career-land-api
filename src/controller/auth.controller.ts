import { AuthService } from "@/services/auth.service";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { HtmlLoader } from "@/lib/utils/html-loader";

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
				const html = HtmlLoader.load("auth-failed.html", {
					ERROR_MESSAGE: "Authorization code is required",
				});
				return ctx.html(html, 400);
			}

			const result = await AuthService.getAccessToken({ ctx, code });

			setCookie(ctx, "token", result.access_token, {
				httpOnly: true,
				secure: true,
				sameSite: "Strict",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			const html = HtmlLoader.load("auth-success.html");
			return ctx.html(html, 200);
		} catch (error) {
			const html = HtmlLoader.load("auth-failed.html", {
				ERROR_MESSAGE:
					error instanceof Error ? error.message : "Authentication failed",
			});
			return ctx.html(html, 401);
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
