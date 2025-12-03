import { useMutation } from "@tanstack/react-query";
import type { IPhoto } from "@/models/photo";
import { useInvalidatePhotos } from "./use-photos";

export interface CreatePhotoInput {
	comment?: string;
	filePath: string;
}

export function useCreatePhoto() {
	const invalidatePhotos = useInvalidatePhotos();

	return useMutation({
		mutationFn: async (input: CreatePhotoInput): Promise<IPhoto> => {
			const response = await fetch("/api/photos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create photo");
			}

			return response.json();
		},
		onSuccess: (_data) => {
			invalidatePhotos();
		},
	});
}
