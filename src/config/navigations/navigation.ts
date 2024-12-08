import { NavigationConfig } from "@/types/navigation";
import {
	BookOpen,
	LayoutDashboard,
	GraduationCap,
	MapPin,
	Cog,
} from "lucide-react";
import { Permission } from "@/config/enums/permission.enum";

export const MainNavigation: NavigationConfig = {
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
			requiredPermissions: [
				Permission.MajorIndex,
				Permission.SubjectIndex,
				Permission.StudentIndex,
			],
			items: [
				{
					title: "navigation.menu.academics.majors.label",
					url: "/academics/majors",
					permission: Permission.MajorIndex,
				},
				{
					title: "navigation.menu.academics.subjects.label",
					url: "/academics/subjects",
					permission: Permission.SubjectIndex,
				},
				{
					title: "navigation.menu.academics.students.label",
					url: "/academics/students",
					permission: Permission.StudentIndex,
				},
			],
		},
		{
			title: "navigation.menu.evaluations.title",
			url: "#",
			icon: GraduationCap,
			requiredPermissions: [
				Permission.GradeIndex,
				Permission.RecommendationIndex,
			],
			items: [
				{
					title: "navigation.menu.evaluations.grades.label",
					url: "/evaluations/grades",
					permission: Permission.GradeIndex,
				},
				{
					title: "navigation.menu.evaluations.recommendations.label",
					url: "/evaluations/recommendations",
					permission: Permission.RecommendationIndex,
				},
			],
		},
	],
	"navigation.groups.setting": [
		{
			title: "navigation.menu.settings.title",
			url: "#",
			icon: Cog,
			requiredPermissions: [Permission.UserIndex, Permission.RoleIndex],
			items: [
				{
					title: "navigation.menu.settings.users.label",
					url: "/settings/users",
					permission: Permission.UserIndex,
				},
				{
					title: "navigation.menu.settings.roles.label",
					url: "/settings/roles",
					permission: Permission.RoleIndex,
				},
			],
		},
	],
	"navigation.groups.region": [
		{
			title: "navigation.menu.locations.title",
			url: "#",
			icon: MapPin,
			requiredPermissions: [
				Permission.ProvinceIndex,
				Permission.RegencyIndex,
				Permission.DistrictIndex,
				Permission.VillageIndex,
			],
			items: [
				{
					title: "navigation.menu.locations.provinces.label",
					url: "/locations/provinces",
					permission: Permission.ProvinceIndex,
				},
				{
					title: "navigation.menu.locations.regencies.label",
					url: "/locations/regencies",
					permission: Permission.RegencyIndex,
				},
				{
					title: "navigation.menu.locations.districts.label",
					url: "/locations/districts",
					permission: Permission.DistrictIndex,
				},
				{
					title: "navigation.menu.locations.villages.label",
					url: "/locations/villages",
					permission: Permission.VillageIndex,
				},
			],
		},
	],
};
