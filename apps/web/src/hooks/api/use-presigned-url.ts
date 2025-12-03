import { useMutation } from "@tanstack/react-query";

export interface PresignedUrlInput {
	fileName: string;
	contentType: string;
	fileSize: number;
}

export interface PresignedUrlResponse {
	url: string;
	filePath: string;
}

export function usePresignedUrl() {
	return useMutation({
		mutationFn: async (input: PresignedUrlInput) => {
			const response = await fetch("/api/photos/presigned-url", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to get presigned URL");
			}

			return response.json();
		},
	});
}
