import { Permission } from "@/config/enums/permission.enum";

// Tambahkan custom permissions
const CUSTOM_PERMISSIONS: Record<string, string> = {
	"/accounts/profile": "users.profile",
	"/accounts/passwords": "users.password",
};

export function getActionFromPath(segments: string[]): string {
	const lastSegment = segments[segments.length - 1];
	switch (lastSegment) {
		case "create":
			return Permission.Create;
		case "edit":
			return Permission.Edit;
		default:
			return Permission.Index;
	}
}

export function checkPermission(
	pathname: string,
	permissions: string[]
): boolean {
	const segments = pathname.split("/").filter(Boolean);
	const fullPath = `/${segments.join("/")}`;

	// Cek custom permissions
	if (CUSTOM_PERMISSIONS[fullPath]) {
		return permissions.includes(CUSTOM_PERMISSIONS[fullPath]);
	}

	// Handle permissions inti
	const moduleName = segments[1]; // Renamed from 'module' to 'moduleName'
	const action = getActionFromPath(segments);
	const requiredPermission = `${moduleName}.${action}`;

	return permissions.includes(requiredPermission);
}
