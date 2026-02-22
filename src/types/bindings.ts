export interface Env {
	DATABASE_URL: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	JWT_SECRET: string;
	FRONTEND_URL: string;
	CAREER_LAND_API_URL: string;
	ROADMAP_GENERATOR_API_URL: string;
}

export type Bindings = Env;
