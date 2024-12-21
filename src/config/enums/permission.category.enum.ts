// Define core permission actions using translation keys
const CoreActions = {
	index: "permission.actions.index",
	store: "permission.actions.store",
	show: "permission.actions.show",
	update: "permission.actions.update",
	destroy: "permission.actions.destroy",
} as const;

// Define module labels using translation keys
const ModuleLabels: Record<string, string> = {
	users: "module.user.users",
	roles: "module.user.roles",
	permissions: "module.user.permissions",
	majors: "module.academic.majors",
	"majors.subjects": "module.academic.major_subjects",
	students: "module.academic.students",
	subjects: "module.academic.subjects",
	provinces: "module.location.provinces",
	regencies: "module.location.regencies",
	districts: "module.location.districts",
	villages: "module.location.villages",
	grades: "module.evaluation.grades",
	recommendations: "module.evaluation.recommendations",
};

// Define custom permission labels using translation keys
const CustomPermissionLabels: Record<string, string> = {
	"users.import": "permission.custom.users.import",
	"users.password": "permission.custom.users.password",
	"users.profile": "permission.custom.users.profile",
};

interface PermissionLabelParts {
	action: string;
	module: string;
}

type PermissionLabelResult = string | PermissionLabelParts;

export function getPermissionCategoryLabel(categoryName: string): string {
	// Pisahkan kategori majors.subjects
	if (categoryName === "majors.subjects") {
		return ModuleLabels["majors.subjects"];
	}

	const label = categoryName.split(".")[0];
	return ModuleLabels[label] || categoryName;
}

export function getPermissionLabel(
	permissionName: string
): PermissionLabelResult {
	if (CustomPermissionLabels[permissionName]) {
		return CustomPermissionLabels[permissionName];
	}

	const parts = permissionName.split(".");

	// Pisahkan permission majors.subjects
	if (parts[0] === "majors" && parts[1] === "subjects") {
		return {
			action: CoreActions[parts[2] as keyof typeof CoreActions],
			module: ModuleLabels["majors.subjects"],
		};
	}

	// Handling untuk permission biasa
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
