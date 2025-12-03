import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { IPhoto } from "@/models/photo";

export interface GetPhotosInput {
	take?: number;
	skip?: number;
}

export interface GetPhotosResponse {
	photos: IPhoto[];
	total: number;
	hasMore: boolean;
}

export function usePhotos(params: GetPhotosInput = {}) {
	return useInfiniteQuery({
		initialPageParam: 1,
		queryKey: ["photos", params.take, params.skip],
		queryFn: async ({ pageParam = 1 }): Promise<GetPhotosResponse> => {
			const urlParams = new URLSearchParams();
			const take = params.take || 10;
			urlParams.set("take", String(take));
			const skip = (pageParam - 1) * take;
			urlParams.set("skip", String(skip));

			const response = await fetch(`/api/photos?${urlParams.toString()}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to get photos");
			}

			return response.json();
		},
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasMore ? allPages.length + 1 : undefined,
	});
}

export const useInvalidatePhotos = () => {
	const queryClient = useQueryClient();

	return () => {
		queryClient.invalidateQueries({ queryKey: ["photos"] });
	};
};
