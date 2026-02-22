import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { DB } from "./lib/database";
import apiRoutes from "./routes";
import type { Bindings } from "./types/bindings";

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	cors({
		origin: "*",
		credentials: true,
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
		const db = new DB({ databaseUrI: c.env.DATABASE_URL });
		await db.client();
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
