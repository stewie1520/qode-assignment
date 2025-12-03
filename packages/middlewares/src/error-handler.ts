import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from "express";
import { z } from "zod";

export interface ErrorResponse {
	error: string;
	details?: unknown;
	stack?: string;
}

export const zodErrorHandler: (isDevelopment: boolean) => ErrorRequestHandler =
	() => {
		return (
			err: unknown,
			_req: Request,
			res: Response,
			next: NextFunction,
		): void => {
			if (err instanceof z.ZodError) {
				res.status(400).json({
					error: "Validation error",
					details: err.issues.map((issue) => ({
						path: issue.path.join("."),
						message: issue.message,
					})),
				});
				return;
			}

			next(err);
		};
	};

export const genericErrorHandler: (
	isDevelopment: boolean,
) => ErrorRequestHandler = (isDevelopment) => {
	return (
		err: unknown,
		_req: Request,
		res: Response,
		_next: NextFunction,
	): void => {
		console.error("Unhandled error:", err);

		if (err instanceof Error) {
			const response: ErrorResponse = {
				error: err.message,
			};

			if (isDevelopment) {
				response.stack = err.stack;
			}

			res.status(500).json(response);
			return;
		}

		res.status(500).json({ error: "Internal server error" });
	};
};

export function createErrorHandler(
	isDevelopment: boolean,
): ErrorRequestHandler[] {
	return [zodErrorHandler(isDevelopment), genericErrorHandler(isDevelopment)];
}
