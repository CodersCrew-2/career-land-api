interface IProfile {
	domain: string;
	goal: string;
	current_level: string;
	skills: string[];
	experience_years: number;
	timeline_months: number;
	daily_hours: number;
	age: number;
	location: string;
	constraints: string[];
	resources_access: string[];
	preferences: Record<string, any>;
}

export interface IRoadmapGenerationParams {
	profile: IProfile;
}

interface IResource {
	title: string;
	url: string;
	type: "article" | "video" | "course" | "book" | "tutorial" | "documentation";
	free: boolean;
}

interface INode {
	id: string;
	label: string;
	description: string;
	category:
		| "technical"
		| "soft-skill"
		| "project"
		| "certification"
		| "networking";
	difficulty: "beginner" | "intermediate" | "advanced";
	estimated_time: string;
	prerequisites: string[];
	resources: IResource[];
}

interface IEdge {
	source: string;
	target: string;
}

interface IRoadmapGraph {
	title: string;
	nodes: INode[];
	edges: IEdge[];
}

export interface IRoadmapGenerationResponse {
	graph: IRoadmapGraph;
}
