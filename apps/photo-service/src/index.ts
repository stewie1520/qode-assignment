import {
	createCorsMiddleware,
	createErrorHandler,
	createHelmetMiddleware,
	createInternalApiMiddleware,
	createLogger,
	createLoggerMiddleware,
} from "@qode-assignment/middlewares";
import "dotenv/config";
import express from "express";
import photoRouter from "./controllers/photo.controller";

const isDevelopment = process.env.NODE_ENV === "development";
const logger = createLogger("photo-service", isDevelopment);
const app = express();

app.use(createHelmetMiddleware());
app.use(createCorsMiddleware({ origin: process.env.CORS_ORIGIN }));

app.use(createLoggerMiddleware({ logger }));

app.use(express.json());

app.get("/health", (_req, res) => {
	res.status(200).send("OK");
});

app.use(createInternalApiMiddleware(process.env.INTERNAL_API_KEY!));

app.use("/photos", photoRouter);

app.use(...createErrorHandler(isDevelopment));

const port = process.env.PORT || 3000;
app.listen(port, () => {
	logger.info(`Photo Service is running on port ${port}`);
});
