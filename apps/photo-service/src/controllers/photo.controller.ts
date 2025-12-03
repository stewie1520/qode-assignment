import { Router } from "express";
import z from "zod";
import { photoService } from "../services/photo.service";

const photoRouter: Router = Router();

/**
 * POST /photos/presigned-url
 * Get a presigned URL for uploading an image
 */
photoRouter.post("/presigned-url", async (req, res) => {
	const presignedUrlSchema = z.object({
		userId: z.string(),
		fileName: z.string(),
		contentType: z.string(),
		fileSize: z.number().positive(),
	});

	const { userId, fileName, contentType, fileSize } =
		await presignedUrlSchema.parseAsync(req.body);

	const result = await photoService.getPresignedUploadUrl({
		userId,
		fileName,
		contentType,
		fileSize,
	});

	return res.json(result);
});

/**
 * POST /photos
 * Create a photo record after the image has been uploaded
 */
photoRouter.post("/", async (req, res) => {
	const createPhotoSchema = z.object({
		userId: z.string(),
		comment: z.string(),
		filePath: z.string(),
	});

	const { userId, comment, filePath } = await createPhotoSchema.parseAsync(
		req.body,
	);

	const photo = await photoService.createPhoto({
		userId,
		comment,
		filePath,
	});

	return res.status(201).json(photo);
});

/**
 * GET /photos/user/:userId
 * Get all photos for a user
 */
photoRouter.get("/user/:userId", async (req, res) => {
	const { userId, take, skip } = z
		.object({
			userId: z.string(),
			take: z.coerce.number().optional(),
			skip: z.coerce.number().optional(),
		})
		.parse({
			userId: req.params.userId,
			take: req.query.take,
			skip: req.query.skip,
		});

	const result = await photoService.getPhotosByUser(userId, take, skip);
	return res.json(result);
});

export default photoRouter;
