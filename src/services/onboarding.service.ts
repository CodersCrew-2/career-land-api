import { CareerLandAgent, RoadmapGeneratorAgent } from "@/lib/agent";
import type {
	IAgentResponse,
	IGeminiResponse,
	IUserProfile,
} from "@/types/career_land";
import type { IOnboardingServiceParams } from "@/types/onboarding";
import type { IRoadmapGenerationResponse } from "@/types/roadmap";
import { randomUUID } from "crypto";

export class OnboardingService {
	public static readonly onboarding = async (
		input_data: IOnboardingServiceParams,
	): Promise<{
		response: IAgentResponse | IRoadmapGenerationResponse;
		sessionId: string;
	}> => {
		const adk = CareerLandAgent.getInstance({
			api: input_data.ctx.env.CAREER_LAND_API_URL,
		});
		if (!input_data.sessionId) {
			const session = await adk.createSession({
				sessionId: randomUUID(),
				userId: input_data.userId,
			});
			if (!session) {
				throw new Error("failed to create session");
			}
			input_data.sessionId = session.id;
		}

		const response = await adk.runAgent({
			message: input_data.query,
			sessionId: input_data.sessionId,
			userId: input_data.userId,
		});
		if (!response || response.length === 0) {
			throw new Error("failed to run agent");
		}

		console.log("Raw agent response:", JSON.stringify(response, null, 2));

		// Parse the response to extract the typed data
		const parsedResponse = OnboardingService.parseAgentResponse(response);

		console.log(
			"Parsed agent response:",
			JSON.stringify(parsedResponse, null, 2),
		);

		if (parsedResponse.type === "question") {
			return {
				response: parsedResponse,
				sessionId: input_data.sessionId,
			};
		} else if (parsedResponse.type === "result") {
			// Normalize the user profile domain before sending to roadmap generator
			const normalizedProfile = OnboardingService.normalizeUserProfile(
				parsedResponse.data as IUserProfile,
			);

			console.log("Normalized profile domain:", normalizedProfile.domain);

			const roadmap = RoadmapGeneratorAgent.getInstance({
				api: input_data.ctx.env.ROADMAP_GENERATOR_API_URL,
			});
			const generatedRoadmap = await roadmap.generateRoadmap({
				profile: normalizedProfile,
			});
			return {
				response: generatedRoadmap,
				sessionId: input_data.sessionId,
			};
		} else {
			throw new Error("unknown response type");
		}
	};

	private static parseAgentResponse(
		response: IGeminiResponse[],
	): IAgentResponse {
		// Get the latest response (last item in array)
		const latestResponse = response[response.length - 1];

		if (!latestResponse) {
			throw new Error("No response data found");
		}

		// Extract the typed response from actions.stateDelta.response
		const typedResponse = latestResponse.actions?.stateDelta?.response as
			| IAgentResponse
			| undefined;

		if (!typedResponse) {
			throw new Error("No typed response found in agent response");
		}

		return typedResponse;
	}

	/**
	 * Maps natural language domain names to supported API domains
	 * Supported domains: 'academics', 'business', 'creative', 'sports', 'tech'
	 */
	private static mapDomainToSupported(domain: string): string {
		const domainLower = domain.toLowerCase().trim();

		// Tech domain mappings
		const techDomains = [
			"data science",
			"software engineering",
			"software development",
			"web development",
			"mobile development",
			"machine learning",
			"artificial intelligence",
			"ai",
			"ml",
			"data engineering",
			"data analysis",
			"data analytics",
			"cybersecurity",
			"devops",
			"cloud computing",
			"blockchain",
			"programming",
			"coding",
			"technology",
			"it",
			"computer science",
		];

		// Business domain mappings
		const businessDomains = [
			"business",
			"management",
			"marketing",
			"finance",
			"entrepreneurship",
			"sales",
			"business development",
			"product management",
			"project management",
			"consulting",
			"strategy",
			"operations",
		];

		// Academics domain mappings
		const academicsDomains = [
			"academics",
			"academic",
			"research",
			"teaching",
			"education",
			"science",
			"mathematics",
			"physics",
			"chemistry",
			"biology",
			"engineering",
			"medicine",
		];

		// Creative domain mappings
		const creativeDomains = [
			"creative",
			"design",
			"art",
			"music",
			"writing",
			"photography",
			"videography",
			"animation",
			"graphics",
			"ui/ux",
			"user experience",
			"user interface",
			"content creation",
		];

		// Sports domain mappings
		const sportsDomains = [
			"sports",
			"sport",
			"athletics",
			"fitness",
			"coaching",
			"personal training",
			"sports management",
		];

		// Check which category the domain belongs to
		if (techDomains.includes(domainLower)) {
			return "tech";
		}
		if (businessDomains.includes(domainLower)) {
			return "business";
		}
		if (academicsDomains.includes(domainLower)) {
			return "academics";
		}
		if (creativeDomains.includes(domainLower)) {
			return "creative";
		}
		if (sportsDomains.includes(domainLower)) {
			return "sports";
		}

		// Default to tech if no match found (since many career paths can benefit from tech skills)
		console.warn(`Unknown domain "${domain}", defaulting to "tech"`);
		return "tech";
	}

	/**
	 * Normalizes the user profile by mapping the domain to supported values
	 */
	private static normalizeUserProfile(profile: IUserProfile): IUserProfile {
		return {
			...profile,
			domain: this.mapDomainToSupported(profile.domain),
		};
	}
}
