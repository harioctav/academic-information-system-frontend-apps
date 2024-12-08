import { usePermissions } from "@/hooks/permissions/use-permission";

export function useGroupPermissions() {
	const { hasPermission } = usePermissions();

	const hasAnyGroupPermission = (permissions: string[]): boolean => {
		return permissions.some((permission) => hasPermission(permission));
	};

	return { hasAnyGroupPermission };
}
