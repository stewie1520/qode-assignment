import { Router } from "express";
import z from "zod";
import { authService } from "../services/auth.service";

const authRouter: Router = Router();

authRouter.post("/create-user", async (req, res) => {
	const createUserSchema = z.object({
		name: z.string(),
		email: z.email(),
		emailVerified: z.coerce.date().nullable().optional(),
		image: z.string(),
	});

	const { name, email, emailVerified, image } =
		await createUserSchema.parseAsync(req.body);
	const user = await authService.createUser({
		name,
		email,
		emailVerified: emailVerified ?? undefined,
		image,
	});
	return res.json(user);
});

authRouter.get("/get-user", async (req, res) => {
	const { id } = z.object({ id: z.string() }).parse(req.query);
	const user = await authService.getUser(id);
	return res.json(user);
});

authRouter.get("/get-user-by-email", async (req, res) => {
	const { email } = z.object({ email: z.string() }).parse(req.query);
	const user = await authService.getUserByEmail(email);
	return res.json(user);
});

authRouter.get("/get-user-by-account", async (req, res) => {
	const { provider, providerAccountId } = z
		.object({ provider: z.string(), providerAccountId: z.string() })
		.parse(req.query);
	const user = await authService.getUserByAccount(provider, providerAccountId);
	return res.json(user);
});

authRouter.post("/link-account", async (req, res) => {
	const linkAccountSchema = z.object({
		providerAccountId: z.string(),
		userId: z.string(),
		type: z.string(),
		provider: z.string(),
		refresh_token: z.string().optional(),
		access_token: z.string().optional(),
		expires_at: z.number().optional(),
		token_type: z.string().optional(),
		scope: z.string().optional(),
		id_token: z.string().optional(),
		session_state: z.string().optional(),
	});

	const data = await linkAccountSchema.parseAsync(req.body);
	const user = await authService.linkAccount(data);
	return res.json(user);
});

export default authRouter;
