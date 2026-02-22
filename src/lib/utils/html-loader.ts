import { authSuccessHtml } from "@/views/auth-success";
import { authFailedHtml } from "@/views/auth-failed";

export class HtmlLoader {
	private static templates: Record<string, string> = {
		"auth-success.html": authSuccessHtml,
		"auth-failed.html": authFailedHtml,
	};

	/**
	 * Load an HTML template
	 * @param fileName - Name of the HTML template
	 * @param variables - Object containing key-value pairs to replace in the template
	 * @returns The HTML content with variables replaced
	 */
	public static load(
		fileName: string,
		variables?: Record<string, string>,
	): string {
		try {
			let html = this.templates[fileName];

			if (!html) {
				throw new Error(`Template not found: ${fileName}`);
			}

			// Replace variables if provided
			if (variables) {
				Object.entries(variables).forEach(([key, value]) => {
					html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
				});
			}

			return html;
		} catch (error) {
			console.error(`Failed to load HTML template: ${fileName}`, error);
			throw new Error(`Failed to load HTML template: ${fileName}`);
		}
	}
}
