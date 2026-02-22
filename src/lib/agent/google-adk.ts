import type {
	ICreateSessionParams,
	IDeleteSessionParams,
	IGeminiResponse,
	IGetSessionParams,
	IListSessionsParams,
	IResponseCreateSession,
	IResponseListApps,
	IResponseListSessions,
	IRunAgentParams,
} from "@/types/career_land";

export class CareerLandAgent {
	private static instance: CareerLandAgent;
	private _baseURL: string;
	private _app_name = "career_land";

	private constructor(
		private config: {
			api: string;
		},
	) {
		this._baseURL = this.config.api;
	}

	public static getInstance(config: { api: string }): CareerLandAgent {
		if (!this.instance) {
			this.instance = new CareerLandAgent(config);
		}
		return this.instance;
	}

	private async request<T>(
		path: string,
		options: RequestInit = {},
	): Promise<T> {
		const response = await fetch(`${this._baseURL}${path}`, {
			...options,
			signal: AbortSignal.timeout(25000),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Request to ${path} failed (${response.status}): ${errorText}`,
			);
		}

		return response.json() as Promise<T>;
	}

	public async getAgents(): Promise<IResponseListApps> {
		return this.request<IResponseListApps>("/list-apps");
	}

	public async getSession(
		params: IGetSessionParams,
	): Promise<IResponseCreateSession> {
		const { userId, sessionId } = params;
		return this.request<IResponseCreateSession>(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`,
		);
	}

	public async createSession(
		params: ICreateSessionParams,
	): Promise<IResponseCreateSession> {
		const { userId, sessionId } = params;
		return this.request<IResponseCreateSession>(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`,
			{
				method: "POST",
				body: JSON.stringify({ userId }),
			},
		);
	}

	public async listSessions(
		params: IListSessionsParams,
	): Promise<IResponseListSessions> {
		const { userId } = params;
		const data = await this.request<IResponseCreateSession[]>(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions`,
		);
		return {
			sessions: data,
		};
	}

	public async runAgent(params: IRunAgentParams): Promise<IGeminiResponse[]> {
		const { userId, sessionId, message, role, streaming, stateDelta } =
			params;
		const parts = [{ text: message }];

		try {
			return await this.request<IGeminiResponse[]>("/run", {
				method: "POST",
				body: JSON.stringify({
					appName: this._app_name,
					userId: userId.toString(),
					sessionId: sessionId,
					newMessage: {
						parts: parts,
						role: role || "user",
					},
					streaming: streaming || false,
					stateDelta: stateDelta || {},
				}),
			});
		} catch (error) {
			console.error("Error in CareerLandAgent.runAgent:", error);
			throw new Error(
				`Failed to run agent: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	public async deleteSession(params: IDeleteSessionParams): Promise<null> {
		const { userId, sessionId } = params;
		return this.request<null>(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId.toString()}`,
			{ method: "DELETE" },
		);
	}
}
