import type {
	IRoadmapGenerationParams,
	IRoadmapGenerationResponse,
} from "@/types/roadmap";

export class RoadmapGeneratorAgent {
	private static instance: RoadmapGeneratorAgent;

	constructor(private config: { api: string }) {}

	public static getInstance(config: { api: string }): RoadmapGeneratorAgent {
		if (!this.instance) {
			this.instance = new RoadmapGeneratorAgent(config);
		}
		return this.instance;
	}

	public async generateRoadmap(
		input_data: IRoadmapGenerationParams,
	): Promise<IRoadmapGenerationResponse> {
		const response = await fetch(`${this.config.api}/v1/roadmaps`, {
			method: "POST",
			signal: AbortSignal.timeout(25000),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(input_data),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Roadmap generation failed (${response.status}): ${errorText}`,
			);
		}

		return response.json() as Promise<IRoadmapGenerationResponse>;
	}
}