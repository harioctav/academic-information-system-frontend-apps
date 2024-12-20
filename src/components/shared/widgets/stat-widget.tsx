import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatWidgetProps {
	icon: LucideIcon;
	value: string | number;
	label: string;
}

export function StatWidget({ icon: Icon, value, label }: StatWidgetProps) {
	return (
		<Card className="hover:shadow-md transition-shadow duration-200">
			<div className="p-6">
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
			</div>
		</Card>
	);
}
