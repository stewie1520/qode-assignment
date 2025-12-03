import pino from "pino";
import type { Options as PinoHttpOptions } from "pino-http";
import pinoHttp from "pino-http";

export function createLogger(name: string, isDevelopment: boolean) {
	return pino({
		name,
		level: isDevelopment ? "debug" : "info",
		transport: isDevelopment
			? {
					target: "pino/file",
					options: { destination: 1 },
				}
			: undefined,
	});
}

export function createLoggerMiddleware(options: PinoHttpOptions = {}) {
	const logger = options.logger;

	return pinoHttp({
		logger,
		autoLogging: {
			ignore: (req) => req.url === "/health",
		},
		customSuccessMessage: (req, res) => {
			return `${req.method} ${req.url} ${res.statusCode}`;
		},
		customErrorMessage: (req, res) => {
			return `${req.method} ${req.url} ${res.statusCode}`;
		},
		...options,
	});
}

export { pino, pinoHttp };
