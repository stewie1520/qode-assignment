import type { HelmetOptions } from "helmet";
import helmet from "helmet";

export type { HelmetOptions };

export function createHelmetMiddleware(options?: HelmetOptions) {
	return helmet({
		contentSecurityPolicy: false,
		...options,
	});
}
