// Parameters for Untangle ADK

export interface IGetSessionParams {
	userId: number;
	sessionId: string;
}

export interface ICreateSessionParams {
	userId: number;
	sessionId: string;
}

export interface IListSessionsParams {
	userId: number;
}

export interface IFiles {
	displayName: string;
	fileUri: string;
	mimeType: string;
}

export interface IFileRaw {
	displayName: string;
	data: string;
	mimeType: string;
}

export interface IRunAgentParams {
	userId: number;
	sessionId: string;
	message: string;
	role?: string;
	streaming?: boolean;
	rawFiles?: IFiles[];
	inlineFiles?: IFileRaw[];
	stateDelta?: Record<string, any>;
}

export interface IDeleteSessionParams {
	userId: number;
	sessionId: string;
}

// Response for Untangle ADK

// Base types
export interface IVideoMetadata {
	fps: number;
	endOffset: string;
	startOffset: string;
}

export interface IInlineData {
	displayName: string;
	data: string;
	mimeType: string;
}

export interface IFileData {
	displayName: string;
	fileUri: string;
	mimeType: string;
}

export interface IFunctionCall {
	id: string;
	args: {
		additionalProp1?: any;
	};
	name: string;
}

export interface ICodeExecutionResult {
	outcome: string;
	output: string;
}

export interface IExecutableCode {
	code: string;
	language: string;
}

export interface IFunctionResponse {
	willContinue: boolean;
	scheduling: string;
	id: string;
	name: string;
	response: {
		additionalProp1?: any;
	};
}

export interface IContentPart {
	videoMetadata?: IVideoMetadata;
	thought?: boolean;
	inlineData?: IInlineData;
	fileData?: IFileData;
	thoughtSignature?: string;
	functionCall?: IFunctionCall;
	codeExecutionResult?: ICodeExecutionResult;
	executableCode?: IExecutableCode;
	functionResponse?: IFunctionResponse;
	text?: string;
}

export interface IContent {
	parts: IContentPart[];
	role: string;
}

export interface IGroundingMetadata {
	googleMapsWidgetContextToken: string;
	groundingChunks: Array<any>;
	groundingSupports: Array<any>;
	retrievalMetadata: any;
	retrievalQueries: string[];
	searchEntryPoint: any;
	webSearchQueries: string[];
}

export interface ISessionEvent {
	content: IContent;
	groundingMetadata?: IGroundingMetadata;
	partial?: boolean;
	turnComplete?: boolean;
	finishReason?: string;
	errorCode?: string;
	errorMessage?: string;
	interrupted?: boolean;
	customMetadata?: {
		additionalProp1?: any;
	};
	usageMetadata?: any;
	liveSessionResumptionUpdate?: any;
	inputTranscription?: any;
	outputTranscription?: any;
	invocationId?: string;
	author?: string;
	actions?: any;
	longRunningToolIds?: string[];
	branch?: string;
	id?: string;
	timestamp?: number;
}

export interface ISession {
	id: string;
	appName: string;
	userId: string;
	state: {
		additionalProp1?: any;
	};
	events: ISessionEvent[];
	lastUpdateTime: number;
}

// List Apps Response
export interface IResponseListApps {
	apps: string[];
}

// Create Session Response
export interface IResponseCreateSession extends ISession {}

// List Sessions Response
export interface IResponseListSessions {
	sessions: ISession[];
}

// Run Agent Response
export interface IResponseRunAgent {
	events: ISessionEvent[];
}

export interface IPreferences {
	learning_style: string;
	intensity: "low" | "medium" | "high";
}

export interface IUserProfile {
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
	preferences: IPreferences;
}

export interface IQuestion {
	id: string;
	text: string;
	input_type: "text" | "number" | "radio" | "dropdown" | "multiselect";
	options?: string[];
	required: boolean;
}

export interface IQuestionResponse {
	message: string;
	questions: IQuestion[];
}

export interface IAgentResponse {
	type: "question" | "result";
	data: IQuestionResponse | IUserProfile;
}

// Gemini API Response Types
export interface ITokenDetails {
	modality: string;
	tokenCount: number;
}

export interface IUsageMetadata {
	cacheTokensDetails?: ITokenDetails[];
	cachedContentTokenCount?: number;
	candidatesTokenCount: number;
	candidatesTokensDetails?: ITokenDetails[];
	promptTokenCount: number;
	promptTokensDetails?: ITokenDetails[];
	thoughtsTokenCount?: number;
	totalTokenCount: number;
	trafficType?: string;
}

export interface IContentParts {
	text?: string;
	[key: string]: any;
}

export interface IContentResponse {
	parts: IContentParts[];
	role: string;
}

export interface IActions {
	stateDelta?: Record<string, any>;
	artifactDelta?: Record<string, any>;
	requestedAuthConfigs?: Record<string, any>;
	requestedToolConfirmations?: Record<string, any>;
}

export interface IGeminiResponse {
	modelVersion: string;
	content: IContentResponse;
	finishReason: string;
	usageMetadata?: IUsageMetadata;
	avgLogprobs?: number;
	invocationId?: string;
	author?: string;
	actions?: IActions;
	id?: string;
	timestamp?: number;
}
