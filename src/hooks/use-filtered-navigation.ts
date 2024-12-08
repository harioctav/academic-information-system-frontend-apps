import { MainNavigation } from "@/config/navigations/navigation";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useGroupPermissions } from "@/hooks/permissions/check-group-permission";
import { NavigationConfig, NavigationItem } from "@/types/navigation";

export function useFilteredNavigation() {
	const { hasPermission } = usePermissions();
	const { hasAnyGroupPermission } = useGroupPermissions();

	const filterNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
		return items.filter((item) => {
			// Check group level permissions
			if (
				item.requiredPermissions &&
				!hasAnyGroupPermission(item.requiredPermissions)
			) {
				return false;
			}

			// Handle sub-items
			if (item.items) {
				const filteredItems = filterNavigationItems(item.items);
				item.items = filteredItems;
				return filteredItems.length > 0;
			}

			// Check individual item permission
			if (item.permission) {
				return hasPermission(item.permission);
			}

			return true;
		});
	};

	const filteredNavigation = Object.entries(MainNavigation).reduce(
		(acc, [key, items]) => {
			acc[key] = filterNavigationItems(items);
			return acc;
		},
		{} as NavigationConfig
	);

	return filteredNavigation;
}
