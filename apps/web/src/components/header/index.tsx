"use client";

import { LogoutOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown } from "antd";
import { signOut } from "next-auth/react";
import { useState } from "react";
import AddPhotoModal from "@/components/add-photo-modal";

export default function Header({
	user,
}: {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}) {
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const items: MenuProps["items"] = [
		{
			key: "profile",
			label: (
				<div style={{ padding: "4px 0" }}>
					<div style={{ fontWeight: 600, marginBottom: 4 }}>
						👋 {user?.name || "User"}
					</div>
					<div style={{ fontSize: "12px", color: "#8c8c8c" }}>
						{user?.email || "No email"}
					</div>
				</div>
			),
		},
		{
			type: "divider",
		},
		{
			key: "logout",
			label: "Logout",
			icon: <LogoutOutlined />,
			onClick: () => {
				signOut();
				queryClient.resetQueries();
			},
		},
	];

	return (
		<div
			style={{
				height: 64,
				background: "#fff",
				padding: "0 24px",
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "center",
				gap: "8px",
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
			}}
		>
			<Button
				type="primary"
				icon={<PlusOutlined />}
				onClick={() => setIsModalOpen(true)}
			>
				Photo
			</Button>
			<AddPhotoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
			<Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
				<Avatar
					src={user?.image ?? undefined}
					icon={<UserOutlined />}
					size="large"
					style={{ cursor: "pointer" }}
				/>
			</Dropdown>
		</div>
	);
}
