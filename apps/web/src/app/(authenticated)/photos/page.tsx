"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { Card, Empty, Masonry, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { usePhotos } from "@/hooks/api/use-photos";
import type { IPhoto } from "@/models/photo";

const { Text } = Typography;

function PhotoCard({ photo }: { photo: IPhoto }) {
	return (
		<Card
			hoverable
			cover={
				<img
					alt={photo.comment || "Photo"}
					src={photo.publicUrl}
					style={{ width: "100%", display: "block" }}
				/>
			}
			styles={{
				body: { padding: 12 },
			}}
		>
			{photo.comment && (
				<Text
					ellipsis={{ tooltip: photo.comment }}
					style={{ display: "block" }}
				>
					{photo.comment}
				</Text>
			)}
			<Text type="secondary" style={{ fontSize: 12 }}>
				{new Date(photo.createdAt).toLocaleDateString()}
			</Text>
		</Card>
	);
}

export default function Page() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		usePhotos({ take: 10 });

	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	useEffect(() => {
		const element = loadMoreRef.current;
		if (!element) return;

		observerRef.current = new IntersectionObserver(handleObserver, {
			threshold: 0.1,
		});
		observerRef.current.observe(element);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [handleObserver]);

	const photos =
		data?.pages.flatMap((page) =>
			page.photos.map((photo) => ({ key: photo.id.toString(), data: photo })),
		) ?? [];

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: 400,
				}}
			>
				<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
			</div>
		);
	}

	if (photos.length === 0) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: 400,
				}}
			>
				<Empty description="No photos yet. Upload your first photo!" />
			</div>
		);
	}

	return (
		<div style={{ padding: 24 }}>
			<Masonry
				columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
				gutter={16}
				items={photos}
				itemRender={(photo) => <PhotoCard photo={photo.data} />}
			/>

			<div
				ref={loadMoreRef}
				style={{
					height: 40,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginTop: 24,
				}}
			>
				{isFetchingNextPage && (
					<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
				)}
			</div>
		</div>
	);
}
