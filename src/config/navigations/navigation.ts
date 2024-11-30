import { SquareTerminal, Bot, BookOpen } from "lucide-react";

export const MainNavigation = {
	"navigation.groups.platform": [
		{
			title: "navigation.menu.playground.title",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{ title: "navigation.menu.playground.history", url: "#" },
				{ title: "navigation.menu.playground.starred", url: "#" },
				{ title: "navigation.menu.playground.settings", url: "#" },
			],
		},
		{
			title: "navigation.menu.models.title",
			url: "#",
			icon: Bot,
			items: [
				{ title: "navigation.menu.models.genesis", url: "#" },
				{ title: "navigation.menu.models.explorer", url: "#" },
				{ title: "navigation.menu.models.quantum", url: "#" },
			],
		},
	],
	"navigation.groups.management": [
		{
			title: "navigation.menu.docs.title",
			url: "#",
			icon: BookOpen,
			items: [
				{ title: "navigation.menu.docs.intro", url: "#" },
				{ title: "navigation.menu.docs.started", url: "#" },
			],
		},
	],
};
