import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import apiRoutes from "./routes";

const app = new Hono();

app.use(cors());
app.use(logger());
app.use(prettyJSON());

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
app.route("/api", apiRoutes);

export default app;
