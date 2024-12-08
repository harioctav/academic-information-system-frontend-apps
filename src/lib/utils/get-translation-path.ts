export function getColumnTranslationPath(columnId: string): string {
	// Map column IDs to their translation paths
	const pathMap: Record<string, string> = {
		// Common inputs
		name: "input.common.name",
		code: "input.common.code",
		type: "input.common.type",
		search: "input.common.search",

		// Meta fields
		created_at: "input.meta.created_at",
		updated_at: "input.meta.updated_at",
		permissions_total: "input.meta.permissions_total",
		users_total: "input.meta.users_total",
		full_code: "input.meta.full_code",

		// User fields
		email: "input.user.email",
		phone: "input.user.phone",
		roles: "input.user.roles",

		regency_province_name: "input.province_name",
		district_regency_province_name: "input.province_name",
		district_regency_name: "input.regency_name",

		// Location fields - Direct
		province_name: "input.province_name",
		regency_name: "input.regency_name",
		district_name: "input.district_name",
		village_name: "input.village_name",
		pos_code: "input.location.pos_code",

		// Location fields - Nested Relations
		"province.name": "input.province_name",
		"regency.name": "input.regency_name",
		"district.name": "input.district_name",
		"village.name": "input.village_name",

		// Location fields - Deep Nested
		"regency.province.name": "input.province_name",
		"district.regency.province.name": "input.province_name",
		"district.regency.name": "input.regency_name",
		"village.district.regency.province.name": "input.province_name",
		"village.district.regency.name": "input.regency_name",
		"village.district.name": "input.district_name",

		// Actions
		actions: "input.actions",
	};

	return `${pathMap[columnId] || `input.common.${columnId}`}.label`;
}
