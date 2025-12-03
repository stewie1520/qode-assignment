"use client";

import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Input, Modal, message, Upload } from "antd";
import { useCallback, useState } from "react";
import { useCreatePhoto } from "../../hooks/api/use-create-photos";
import { usePresignedUrl } from "../../hooks/api/use-presigned-url";

const { TextArea } = Input;
const { Dragger } = Upload;

interface AddPhotoModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export default function AddPhotoModal({
	open,
	onClose,
	onSuccess,
}: AddPhotoModalProps) {
	const { mutateAsync: getPresignedUrl } = usePresignedUrl();
	const { mutateAsync: createPhoto } = useCreatePhoto();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [comment, setComment] = useState("");
	const [uploading, setUploading] = useState(false);

	const resetForm = useCallback(() => {
		setFileList([]);
		setComment("");
	}, []);

	const handleClose = useCallback(() => {
		if (!uploading) {
			resetForm();
			onClose();
		}
	}, [uploading, resetForm, onClose]);

	const uploadProps: UploadProps = {
		name: "file",
		multiple: false,
		accept: "image/*",
		fileList,
		beforeUpload: (file) => {
			const isImage = file.type.startsWith("image/");
			if (!isImage) {
				message.error("You can only upload image files!");
				return Upload.LIST_IGNORE;
			}
			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				message.error("Image must be smaller than 10MB!");
				return Upload.LIST_IGNORE;
			}
			setFileList([file as unknown as UploadFile]);
			return false;
		},
		onRemove: () => {
			setFileList([]);
		},
	};

	const handleSubmit = async () => {
		if (fileList.length === 0) {
			message.error("Please select an image to upload");
			return;
		}

		if (comment.length > 500) {
			message.error("Comment must be less than 500 characters");
			return;
		}

		if (!comment.trim()) {
			message.error("Please enter a comment");
			return;
		}

		const file = fileList[0] as unknown as File;
		setUploading(true);

		try {
			const { uploadUrl, filePath } = await getPresignedUrl({
				fileName: file.name,
				contentType: file.type,
				fileSize: file.size,
			});

			const uploadResponse = await fetch(uploadUrl, {
				method: "PUT",
				headers: {
					"Content-Type": file.type,
				},
				body: file,
			});

			if (!uploadResponse.ok) {
				throw new Error("Failed to upload file to storage");
			}

			await uploadResponse.text();

			await createPhoto({ filePath, comment });

			message.success("Photo uploaded successfully!");
			resetForm();
			onClose();
			onSuccess?.();
		} catch (error) {
			console.error("Upload error:", error);
			message.error(
				error instanceof Error ? error.message : "Failed to upload photo",
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<Modal
			title="Add your photo"
			open={open}
			onCancel={handleClose}
			footer={
				<div className="flex gap-2 pt-4">
					<Button key="cancel" onClick={handleClose} disabled={uploading}>
						Cancel
					</Button>
					<Button
						key="submit"
						type="primary"
						onClick={handleSubmit}
						loading={uploading}
						disabled={fileList.length === 0}
					>
						{uploading ? "Uploading..." : "Upload"}
					</Button>
				</div>
			}
			maskClosable={!uploading}
			closable={!uploading}
		>
			<div style={{ marginBottom: 16 }}>
				<Dragger {...uploadProps} disabled={uploading}>
					<p className="ant-upload-drag-icon">
						{uploading ? <LoadingOutlined /> : <InboxOutlined />}
					</p>
					<p className="ant-upload-text">
						Click or drag photo to this area to upload
					</p>
					<p className="ant-upload-hint">
						Support for single image upload. Max file size: 10MB
					</p>
				</Dragger>
			</div>

			<div>
				<label
					htmlFor="photo-comment"
					style={{
						display: "block",
						marginBottom: 8,
						fontWeight: 500,
					}}
				>
					Comment
				</label>
				<TextArea
					id="photo-comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Add a comment about your photo..."
					rows={3}
					disabled={uploading}
					maxLength={500}
					showCount
				/>
			</div>
		</Modal>
	);
}
