class GoogleAuth {
	private static instance: GoogleAuth;

	private constructor(
		private config: {
			googleClientId: string;
			googleClientSecret: string;
			googleRedirectUri: string;
		},
	) {}

	/**
	 * Get the singleton instance of GoogleAuth
	 */
	public static getInstance({
		googleClientId,
		googleClientSecret,
		googleRedirectUri,
	}: {
		googleClientId: string;
		googleClientSecret: string;
		googleRedirectUri: string;
	}): GoogleAuth {
		if (!GoogleAuth.instance) {
			GoogleAuth.instance = new GoogleAuth({
				googleClientId,
				googleClientSecret,
				googleRedirectUri,
			});
		}
		return GoogleAuth.instance;
	}

	/**
	 * Generate Google OAuth2 authentication URL
	 */
	public getAuthUrl(sessionId?: string) {
		const state = sessionId
			? `session:${sessionId}`
			: crypto.randomUUID();

		const params = new URLSearchParams({
			client_id: this.config.googleClientId,
			redirect_uri: this.config.googleRedirectUri,
			response_type: "code",
			scope: [
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile",
			].join(" "),
			access_type: "offline",
			include_granted_scopes: "true",
			state,
		});

		return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
	}

	/**
	 * Exchange authorization code for access tokens
	 */
	public async getTokens(code: string) {
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				code,
				client_id: this.config.googleClientId,
				client_secret: this.config.googleClientSecret,
				redirect_uri: this.config.googleRedirectUri,
				grant_type: "authorization_code",
			}),
		});

		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(`Token exchange failed: ${errorData}`);
		}

		const tokens = (await response.json()) as {
			access_token?: string;
			refresh_token?: string;
			expires_in?: number;
			token_type?: string;
			scope?: string;
			id_token?: string;
		};
		return tokens;
	}

	/**
	 * Retrieve user profile information using the access token
	 */
	public async me(accessToken: string) {
		const response = await fetch(
			"https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,photos",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(`Failed to fetch user profile: ${errorData}`);
		}

		const person = (await response.json()) as {
			emailAddresses?: { value?: string }[];
			names?: { displayName?: string }[];
			photos?: { url?: string }[];
		};

		const email = person.emailAddresses?.[0]?.value;
		const name = person.names?.[0]?.displayName;
		const profilePic = person.photos?.[0]?.url;

		if (!email) {
			throw new Error("Email not found in Google user profile");
		}

		return {
			email,
			name,
			profilePic,
		};
	}
}

export default GoogleAuth;
