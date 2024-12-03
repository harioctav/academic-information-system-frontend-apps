// Define core permission actions using translation keys
const CoreActions = {
	index: "permission.index",
	store: "permission.store",
	show: "permission.show",
	update: "permission.update",
	destroy: "permission.destroy",
} as const;

// Define custom module labels using translation keys
const ModuleLabels: Record<string, string> = {
	users: "module.users",
	roles: "module.roles",
	permissions: "module.permissions",
	majors: "module.majors",
	students: "module.students",
	subjects: "module.subjects",
	provinces: "module.provinces",
	regencies: "module.regencies",
	districts: "module.districts",
	villages: "module.villages",
	grades: "module.grades",
	recommendations: "module.recommendations",
};

// Define custom permission labels using translation keys
const CustomPermissionLabels: Record<string, string> = {
	"users.import": "permission.users.import",
	"users.password": "permission.users.password",
	"users.profile": "permission.users.profile",
};

interface PermissionLabelParts {
	action: string;
	module: string;
}

type PermissionLabelResult = string | PermissionLabelParts;

export function getPermissionCategoryLabel(categoryName: string): string {
	const label = categoryName.split(".")[0];
	return ModuleLabels[label] || categoryName;
}

export function getPermissionLabel(
	permissionName: string
): PermissionLabelResult {
	if (CustomPermissionLabels[permissionName]) {
		return CustomPermissionLabels[permissionName];
	}

	const [module, action] = permissionName.split(".");
	const moduleKey = ModuleLabels[module] || module;

	if (CoreActions[action as keyof typeof CoreActions]) {
		return {
			action: CoreActions[action as keyof typeof CoreActions],
			module: moduleKey,
		};
	}

	return permissionName;
}
