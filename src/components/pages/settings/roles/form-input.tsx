"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { getRoleLabel } from "@/config/enums/role.enum";
import { permissionCategoryService } from "@/lib/services/settings/permission-category.service";
import { roleService } from "@/lib/services/settings/role.service";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/from-prop";
import { Permission } from "@/types/settings/permission";
import { PermissionCategory } from "@/types/settings/permission-category";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PermissionCategoryCard from "@/components/pages/permission-category-card";

const RoleFormInput = ({ uuid, isEdit }: FormProps) => {
	const [name, setName] = useState("");
	const [permissionCategories, setPermissionCategories] = useState<
		PermissionCategory[]
	>([]);
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const loadRoleData = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await roleService.showRole(uuid);
			setName(response.data.name);

			if (response.data.permissions && response.data.permissions.length > 0) {
				setSelectedPermissions(response.data.permissions);
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load province data"
			);
		}
	}, [uuid]);

	const loadPermissionCategories = async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		try {
			const response = await permissionCategoryService.getPermissionCategories({
				page,
				perPage: 3,
				sortBy: "name",
				sortDirection: "asc",
			});

			if (page === 1) {
				setPermissionCategories(response.data);
			} else {
				setPermissionCategories((prev) => [...prev, ...response.data]);
			}

			// Check if meta exists and has last_page
			setHasMore(response.meta ? page < response.meta.last_page : false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load data"
			);
		} finally {
			setLoading(false);
		}
	};

	const observer = useRef<IntersectionObserver>();
	const lastCardRef = useCallback(
		(node: HTMLDivElement) => {
			if (loading) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	useEffect(() => {
		if (isEdit && uuid) {
			loadRoleData();
		}
		loadPermissionCategories();
	}, [isEdit, uuid, page]);

	const handlePermissionChange = (permission: Permission) => {
		setSelectedPermissions((prev) => {
			if (prev.includes(permission.name)) {
				return prev.filter((name) => name !== permission.name);
			}
			return [...prev, permission.name];
		});
	};

	const handleCategoryChange = (permissions: Permission[]) => {
		const permissionNames = permissions.map((p) => p.name);

		setSelectedPermissions((prev) => {
			const allSelected = permissionNames.every((name) => prev.includes(name));
			if (allSelected) {
				return prev.filter((name) => !permissionNames.includes(name));
			}
			return [...new Set([...prev, ...permissionNames])];
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const formData = {
				name: name,
				permissions: selectedPermissions,
			};

			if (isEdit && uuid) {
				const response = await roleService.updateRole(uuid, formData);
				toast.success(response.message);
			}

			router.push("/settings/roles");
			router.refresh();
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);
			}
			toast.error(
				apiError.message || "An error occurred while saving the province"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full py-6">
			<form onSubmit={handleSubmit}>
				<div className="mb-6">
					<Label htmlFor="name" className="text-sm font-medium">
						Name
					</Label>
					<div className="flex items-center justify-between mt-2">
						<Input
							type="text"
							id="name"
							name="name"
							value={getRoleLabel(name)}
							readOnly
							disabled
							className="max-w-md"
						/>

						<div className="flex items-center space-x-2">
							<Switch
								id="select-all"
								checked={permissionCategories.every((category) =>
									category.permissions.every((p) =>
										selectedPermissions.includes(p.name)
									)
								)}
								onCheckedChange={(checked) => {
									if (checked) {
										const allPermissions = permissionCategories.flatMap(
											(category) => category.permissions.map((p) => p.name)
										);
										setSelectedPermissions(allPermissions);
									} else {
										setSelectedPermissions([]);
									}
								}}
							/>
							<Label htmlFor="select-all">Select All Permissions</Label>
						</div>
					</div>
					{errors.name && (
						<span className="text-sm text-red-500">{errors.name}</span>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{permissionCategories.map((category, index) => (
						<div
							key={category.uuid}
							ref={
								index === permissionCategories.length - 1 ? lastCardRef : null
							}
						>
							<PermissionCategoryCard
								category={category}
								selectedPermissions={selectedPermissions}
								onPermissionChange={handlePermissionChange}
								onCategoryChange={handleCategoryChange}
							/>
						</div>
					))}
				</div>

				<SubmitButton type="submit" isLoading={isLoading} className="mt-6">
					{isEdit ? "Update Data" : "Create New Data"}
				</SubmitButton>
			</form>
		</div>
	);
};

export default RoleFormInput;
