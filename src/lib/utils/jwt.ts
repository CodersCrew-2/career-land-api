import type { IJwtUserPayload } from "@/types/user";
import type { Context } from "hono";
import { sign, verify } from "hono/jwt";

export async function signToken({
	user,
	secret,
}: {
	user: IJwtUserPayload;
	secret: string;
}): Promise<string> {
	return await sign({ id: user.id }, secret);
}

export async function verifyToken({
	token,
	ctx,
}: {
	token: string;
	ctx: Context;
}): Promise<IJwtUserPayload | null> {
	try {
		const secret = ctx.env.JWT_SECRET;
		const payload = (await verify(
			token,
			secret,
			"HS256",
		)) as unknown as IJwtUserPayload;
		return payload;
	} catch (error) {
		console.error("Token verification failed:", error);
		return null;
	}
}
