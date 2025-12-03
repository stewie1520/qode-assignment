import db from "@/db";
import type { PrismaClient } from "@/db/prisma/generated/client";
import { type FileService, s3FileService } from "../lib/s3";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class PhotoService {
	constructor(
		private readonly db: PrismaClient,
		private readonly s3FileService: FileService,
	) {}

	async getPresignedUploadUrl(params: {
		userId: string;
		fileName: string;
		contentType: string;
		fileSize: number;
	}): Promise<{ uploadUrl: string; filePath: string }> {
		const { userId, fileName, contentType, fileSize } = params;

		if (!contentType.startsWith("image/")) {
			throw new Error("Invalid content type. Allowed types: image/*");
		}

		if (fileSize > MAX_FILE_SIZE) {
			throw new Error(
				`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
			);
		}

		const timestamp = Date.now();
		const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
		const filePath = `photos/${userId}/${timestamp}-${sanitizedFileName}`;

		const uploadUrl = await this.s3FileService.getUploadUrl(
			filePath,
			contentType,
			fileSize,
		);

		return { uploadUrl, filePath };
	}

	/**
	 * Check if a file exists in S3
	 */
	async checkFileExists(filePath: string): Promise<{
		exists: boolean;
		contentType?: string;
		size?: number;
	}> {
		try {
			const result = await this.s3FileService.isFileExisted(filePath);

			return {
				exists: result.exists,
				contentType: result.contentType,
				size: result.size,
			};
		} catch (error) {
			if (error instanceof Error && error.name === "NotFound") {
				return { exists: false };
			}
			throw error;
		}
	}

	/**
	 * Create a photo record after the image has been uploaded
	 */
	async createPhoto(params: {
		userId: string;
		comment: string;
		filePath: string;
	}) {
		const { userId, comment, filePath } = params;

		const fileInfo = await this.checkFileExists(filePath);
		if (!fileInfo.exists) {
			throw new Error("Image file not found. Please upload the image first.");
		}

		if (fileInfo.contentType && !fileInfo.contentType.startsWith("image/")) {
			throw new Error("Invalid file type. Only images are allowed.");
		}

		const publicUrl = await this.s3FileService.getPublicUrl(filePath);

		const photo = await this.db.photo.create({
			data: {
				userId,
				comment,
				filePath,
				contentType: fileInfo.contentType ?? "image/jpeg",
				size: fileInfo.size ?? 0,
			},
		});

		return {
			...photo,
			publicUrl,
		};
	}

	async getPhotosByUser(userId: string, take = 10, skip = 0) {
		const [photos, total] = await Promise.all([
			this.db.photo.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
				take,
				skip,
			}),
			this.db.photo.count({ where: { userId } }),
		]);

		const photoWithUrls = await Promise.all(
			photos.map(async (photo) => {
				const publicUrl = await this.s3FileService.getPublicUrl(photo.filePath);
				return { ...photo, publicUrl };
			}),
		);

		return { photos: photoWithUrls, total, hasMore: total > skip + take };
	}
}

export const photoService = new PhotoService(db, s3FileService);
