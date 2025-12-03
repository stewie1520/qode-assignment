import {
	createCorsMiddleware,
	createErrorHandler,
	createHelmetMiddleware,
	createInternalApiMiddleware,
	createLogger,
	createLoggerMiddleware,
} from "@qode-assignment/middlewares";
import express from "express";
import { config } from "./config";
import photoRouter from "./controllers/photo.controller";

const isDevelopment = config.NODE_ENV === "development";
const logger = createLogger("photo-service", isDevelopment);
const app = express();

app.use(createHelmetMiddleware());
app.use(createCorsMiddleware({ origin: config.CORS_ORIGIN }));

app.use(createLoggerMiddleware({ logger }));

app.use(express.json());

app.get("/health", (_req, res) => {
	res.status(200).send("OK");
});

app.use(createInternalApiMiddleware(config.INTERNAL_API_KEY));

app.use("/photos", photoRouter);

app.use(...createErrorHandler(isDevelopment));

app.listen(config.PORT, () => {
	logger.info(`Photo Service is running on port ${config.PORT}`);
});
