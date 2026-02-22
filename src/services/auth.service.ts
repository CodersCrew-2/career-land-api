import { User } from "@/lib/database/models/user.models";
import googleAuth from "@/lib/google";
import { signToken } from "@/lib/utils/jwt";
import type { Context } from "hono";

export class AuthService {
	public static readonly getAuthorizeUrI = ({
		ctx,
	}: {
		ctx: Context;
	}): { url: string } => {
		const google = googleAuth.getInstance({
			googleClientId: ctx.env.GOOGLE_CLIENT_ID,
			googleClientSecret: ctx.env.GOOGLE_CLIENT_SECRET,
			googleRedirectUri: ctx.env.GOOGLE_REDIRECT_URI,
		});

		const url = google.getAuthUrl();

		return {
			url,
		};
	};

	public static readonly getAccessToken = async ({
		ctx,
		code,
	}: {
		ctx: Context;
		code: string;
	}) => {
		const google = googleAuth.getInstance({
			googleClientId: ctx.env.GOOGLE_CLIENT_ID,
			googleClientSecret: ctx.env.GOOGLE_CLIENT_SECRET,
			googleRedirectUri: ctx.env.GOOGLE_REDIRECT_URI,
		});

		const token = await google.getTokens(code);
		if (!token.access_token) {
			throw new Error("authentication failed");
		}

		const google_user = await google.me(token.access_token);
		if (!google_user || !google_user.email) {
			throw new Error("Failed to retrieve user email from Google");
		}

		let user = await User.findOne({ email: google_user.email });
		if (!user) {
			user = new User({
				firstName: google_user.name || "Unknown",
				email: google_user.email,
				access_token: token.access_token,
				refresh_token: token.refresh_token,
			});
			await user.save();
		}

		const jwt_token = await signToken({
			secret: ctx.env.JWT_SECRET,
			user: { id: user._id.toString() },
		});
		if (!jwt_token) {
			throw new Error("authentication failed");
		}

		return {
			user: {
				id: user._id.toString(),
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			},
			access_token: jwt_token,
		};
	};
}
