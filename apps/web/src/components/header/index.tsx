"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown } from "antd";
import { signOut } from "next-auth/react";

export default function Header({
	user,
}: {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}) {
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
			onClick: () => signOut(),
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
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
			}}
		>
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
