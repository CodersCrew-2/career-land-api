import axios from "axios";
import type { IRoadmapGenerationParams, IRoadmapGenerationResponse } from "@/types/roadmap";

export class RoadmapGeneratorAgent {
	private static instance: RoadmapGeneratorAgent;

	constructor(private config: { api: string }) {}

	public static getInstance(config: { api: string }): RoadmapGeneratorAgent {
		if (!this.instance) {
			this.instance = new RoadmapGeneratorAgent(config);
		}
		return this.instance;
	}

	public async generateRoadmap(input_data: IRoadmapGenerationParams) {
		const { data } = await axios.post<IRoadmapGenerationResponse>(
			`${this.config.api}/v1/roadmaps`,
			input_data,
		);
		return data;
	}
}