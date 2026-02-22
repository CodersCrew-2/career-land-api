import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { connectDB } from "./lib/database";
import apiRoutes from "./routes";
import type { Bindings } from "./types/bindings";

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	cors({
		origin: ["https://careerland.rookie.house", "http://localhost:3000"],
		credentials: true,
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Set-Cookie"],
	}),
);
app.use(logger());
app.use(prettyJSON());

// Middleware to ensure database connection
app.use("*", async (c, next) => {
	if (!c.env.DATABASE_URL) {
		return c.json(
			{
				success: false,
				error: "Database configuration is missing",
			},
			500,
		);
	}

	try {
		const db = await connectDB(c.env.DATABASE_URL);
		c.set("db", db);
		await next();
	} catch (error) {
		return c.json(
			{
				success: false,
				error:
					error instanceof Error
						? `Database connection failed: ${error.message}`
						: "Database connection failed",
			},
			500,
		);
	}
});

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
app.route("/api", apiRoutes);

export default app;
