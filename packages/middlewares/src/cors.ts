import type { CorsOptions } from "cors";
import cors from "cors";

export type { CorsOptions };

export interface CorsConfig {
	origin?: string | string[];
	methods?: string[];
	credentials?: boolean;
}

export function createCorsMiddleware(config?: CorsConfig) {
	const options: CorsOptions = {
		origin: config?.origin || "*",
		methods: config?.methods || [
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"PATCH",
			"OPTIONS",
		],
		credentials: config?.credentials ?? true,
		optionsSuccessStatus: 200,
	};

	return cors(options);
}
