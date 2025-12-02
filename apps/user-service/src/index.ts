import cors from "cors";
import "dotenv/config";
import express from "express";
import authRouter from "./controllers/auth.controller";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "",
		methods: ["GET", "POST", "OPTIONS"],
	}),
);

app.use(express.json());

app.get("/health", (_req, res) => {
	res.status(200).send("OK");
});

app.use("/auth", authRouter);

const port = process.env.PORT || 3002;
app.listen(port, () => {
	console.log(`User Service is running on port ${port}`);
});
