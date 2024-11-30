import { useAuth } from "@/lib/auth/auth-provider";

export function usePermissions() {
	const { user } = useAuth();

	const hasPermission = (permission: string): boolean => {
		return (
			user?.roles?.some((role) => role.permissions.includes(permission)) ??
			false
		);
	};

	return { hasPermission };
}
