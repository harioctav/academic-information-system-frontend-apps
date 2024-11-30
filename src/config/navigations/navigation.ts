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
					url: "#",
				},
				{
					title: "navigation.menu.academics.subjects.label",
					url: "#",
				},
				{
					title: "navigation.menu.academics.students.label",
					url: "#",
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
					url: "#",
				},
				{
					title: "navigation.menu.evaluations.recommendations.label",
					url: "#",
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
					url: "#",
				},
				{
					title: "navigation.menu.settings.roles.label",
					url: "#",
				},
			],
		},
	],
	"navigation.groups.region": [
		{
			title: "navigation.menu.regions.title",
			url: "#",
			icon: MapPin,
			items: [
				{
					title: "navigation.menu.regions.provinces.label",
					url: "/locations/provinces",
				},
				{
					title: "navigation.menu.regions.regencies.label",
					url: "/locations/regencies",
				},
				{
					title: "navigation.menu.regions.districts.label",
					url: "/locations/districts",
				},
				{
					title: "navigation.menu.regions.villages.label",
					url: "/locations/villages",
				},
			],
		},
	],
};
