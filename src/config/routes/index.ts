export const routes = {
	public: ["/auth/login", "/auth/register", "/auth/forgot-password"],
	modules: {
		settings: ["/settings/users", "/settings/roles"],
		locations: [
			"/locations/provinces",
			"/locations/regencies",
			"/locations/districts",
			"/locations/villages",
		],
		academics: [
			"/academics/majors",
			"/academics/subjects",
			"/academics/students",
		],
		evaluations: ["/evaluations/grades", "/evaluations/recommendations"],
		accounts: ["/accounts/profile", "/accounts/passwords"],
	},
} as const;

export const validModulePaths = Object.values(routes.modules).flat();

export const matcherPaths = [
	"/",
	"/auth/:path*",
	"/dashboard/:path*",
	"/settings/:path*",
	"/locations/:path*",
	"/academics/:path*",
	"/evaluations/:path*",
	"/accounts/:path*",
] as const;

export type PublicRoute = (typeof routes.public)[number];
export type ModulePath = (typeof validModulePaths)[number];
