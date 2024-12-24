import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LucideIcon } from "lucide-react";

interface StatWidgetProps {
	icon: LucideIcon;
	value: string | number;
	label: string;
	isLoading?: boolean;
}

export function StatWidget({
	icon: Icon,
	value,
	label,
	isLoading,
}: StatWidgetProps) {
	return (
		<Card className="hover:shadow-md transition-shadow duration-200">
			<div className="p-6">
				{isLoading ? (
					<LoadingSpinner className="min-h-[80px]" />
				) : (
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground">
							<Icon className="h-8 w-8 opacity-75" />
						</div>
						<div className="text-right">
							<div className="text-3xl font-semibold">{value}</div>
							<div className="text-sm font-medium uppercase text-muted-foreground">
								{label}
							</div>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
