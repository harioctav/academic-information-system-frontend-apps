import {
	BookOpen,
	LayoutDashboard,
	GraduationCap,
	MapPin,
	Cog,
} from "lucide-react";

export const MainNavigation = {
	"pages.home": [
		{
			title: "pages.home",
			icon: LayoutDashboard,
			url: "/",
		},
	],
	"navigation.groups.academic": [
		{
			title: "navigation.menu.academics.title",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "navigation.menu.academics.majors.label",
					url: "/academics/majors",
				},
				{
					title: "navigation.menu.academics.subjects.label",
					url: "/academics/subjects",
				},
				{
					title: "navigation.menu.academics.students.label",
					url: "/academics/students",
				},
			],
		},
		{
			title: "navigation.menu.evaluations.title",
			url: "#",
			icon: GraduationCap,
			items: [
				{
					title: "navigation.menu.evaluations.grades.label",
					url: "/evaluations/grades",
				},
				{
					title: "navigation.menu.evaluations.recommendations.label",
					url: "/evaluations/recommendations",
				},
			],
		},
	],
	"navigation.groups.setting": [
		{
			title: "navigation.menu.settings.title",
			url: "#",
			icon: Cog,
			items: [
				{
					title: "navigation.menu.settings.users.label",
					url: "/settings/users",
				},
				{
					title: "navigation.menu.settings.roles.label",
					url: "/settings/roles",
				},
			],
		},
	],
	"navigation.groups.region": [
		{
			title: "navigation.menu.locations.title",
			url: "#",
			icon: MapPin,
			items: [
				{
					title: "navigation.menu.locations.provinces.label",
					url: "/locations/provinces",
				},
				{
					title: "navigation.menu.locations.regencies.label",
					url: "/locations/regencies",
				},
				{
					title: "navigation.menu.locations.districts.label",
					url: "/locations/districts",
				},
				{
					title: "navigation.menu.locations.villages.label",
					url: "/locations/villages",
				},
			],
		},
	],
};
