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
import axios, { type AxiosInstance } from "axios";

export class CareerLandAgent {
	private static instance: CareerLandAgent;
	private _axios: AxiosInstance;
	private _app_name = "career_land";

	private constructor(
		private config: {
			api: string;
		},
	) {
		this._axios = axios.create({
			baseURL: this.config.api,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			withCredentials: true,
		});
	}

	public static getInstance(config: { api: string }): CareerLandAgent {
		if (!this.instance) {
			this.instance = new CareerLandAgent(config);
		}
		return this.instance;
	}

	public async getAgents(): Promise<IResponseListApps> {
		const { data } = await this._axios.get("/list-apps");
		return data;
	}

	public async getSession(
		params: IGetSessionParams,
	): Promise<IResponseCreateSession> {
		const { userId, sessionId } = params;
		const { data } = await this._axios.get(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`,
		);
		return data;
	}

	public async createSession(
		params: ICreateSessionParams,
	): Promise<IResponseCreateSession> {
		const { userId, sessionId } = params;
		const { data } = await this._axios.post(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`,
			{
				userId,
			},
		);
		return data;
	}

	public async listSessions(
		params: IListSessionsParams,
	): Promise<IResponseListSessions> {
		const { userId } = params;
		const { data } = await this._axios.get(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions`,
		);
		return {
			sessions: data,
		};
	}

	public async runAgent(params: IRunAgentParams): Promise<IGeminiResponse[]> {
		const { userId, sessionId, message, role, streaming, stateDelta } = params;
		const parts = [{ text: message }];

		try {
			const { data } = await this._axios.post("/run", {
				appName: this._app_name,
				userId: userId.toString(),
				sessionId: sessionId,
				newMessage: {
					parts: parts,
					role: role || "user",
				},
				streaming: streaming || false,
				stateDelta: stateDelta || {},
			});
			if (!data) {
				throw new Error("No response data from run endpoint");
			}
			return data;
		} catch (error) {
			console.error("Error in CareerLandAgent.runAgent:", error);
			throw new Error(
				`Failed to run agent: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	public async deleteSession(params: IDeleteSessionParams): Promise<null> {
		const { userId, sessionId } = params;
		const { data } = await this._axios.delete(
			`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId.toString()}`,
		);
		return data;
	}
}
