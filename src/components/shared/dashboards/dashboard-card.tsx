import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCardProps } from "@/types/common";
import React from "react";

const DashboardCard = ({
	title,
	value,
	metric,
	change,
}: DashboardCardProps) => {
	return (
		<Card className="w-full max-w-xs">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center space-y-2">
					<div className="text-4xl font-bold">{value}</div>
					<div className="text-sm font-medium text-gray-500">{metric}</div>
					<div
						className={`text-sm font-medium ${
							change >= 0 ? "text-green-500" : "text-red-500"
						}`}
					>
						{change >= 0 ? `+${change}%` : `${change}%`}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default DashboardCard;
