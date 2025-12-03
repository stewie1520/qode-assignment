import {
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "@/config";

export interface FileService {
	getPublicUrl(key: string): Promise<string>;
	getUploadUrl(key: string, contentType: string, size: number): Promise<string>;
	isFileExisted(
		key: string,
	): Promise<{ exists: boolean; contentType?: string; size?: number }>;
}

const s3Client = new S3Client({
	region: config.AWS_REGION,
	credentials: {
		accessKeyId: config.AWS_ACCESS_KEY_ID,
		secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
	},
});

const S3_BUCKET = config.AWS_S3_BUCKET;

class S3FileService implements FileService {
	constructor(private readonly s3Client: S3Client) {}

	async getPublicUrl(key: string) {
		const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
		return await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
	}

	async getUploadUrl(key: string, contentType: string, fileSize: number) {
		const command = new PutObjectCommand({
			Bucket: S3_BUCKET,
			Key: key,
			ContentType: contentType,
			ContentLength: fileSize,
		});

		return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
	}

	async isFileExisted(
		key: string,
	): Promise<{ exists: boolean; contentType?: string; size?: number }> {
		const command = new HeadObjectCommand({
			Bucket: S3_BUCKET,
			Key: key,
		});

		const response = await s3Client.send(command);

		if (response.$metadata.httpStatusCode === 200) {
			return {
				exists: true,
				contentType: response.ContentType,
				size: response.ContentLength,
			};
		}

		return {
			exists: false,
		};
	}
}

export const s3FileService = new S3FileService(s3Client);
