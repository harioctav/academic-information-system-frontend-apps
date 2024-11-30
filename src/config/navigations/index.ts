import { Projects } from "@/config/navigations/project";
import { SecondaryNavigation } from "@/config/navigations/secondary";
import { User } from "@/config/navigations/user";
import { MainNavigation } from "@/config/navigations/navigation";

export const navigation = {
	MainNavigation,
	SecondaryNavigation,
	Projects,
	User,
};

export type Navigation = typeof navigation;
