import { LucideIcon } from "lucide-react";

export interface NavigationItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	permission?: string;
	requiredPermissions?: string[];
	items?: Omit<NavigationItem, "icon">[];
}

export type NavigationConfig = {
	[key: string]: NavigationItem[];
};
