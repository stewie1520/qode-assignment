import type { NextFunction, Request, Response } from "express";

export const INTERNAL_API_HEADER = "X-Internal-API";

export const createInternalApiMiddleware =
	(apiKey: string) =>
	(req: Request, res: Response, next: NextFunction): void => {
		if (req.headers[INTERNAL_API_HEADER.toLowerCase()] === apiKey) {
			next();
		} else {
			res.status(401).json({ error: "Unauthorized" });
		}
	};
