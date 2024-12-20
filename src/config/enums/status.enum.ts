import { BadgeVariant } from "@/components/ui/badge";
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

export enum Status {
	Inactive = 0,
	Active = 1,
}

export const StatusBadgeVariant: Record<Status, "green" | "red"> = {
	[Status.Active]: "green",
	[Status.Inactive]: "red",
};

export const getStatusLabel = (status: number, t: TFunction): string => {
	switch (status) {
		case Status.Active:
			return t("message.status.active");
		case Status.Inactive:
			return t("message.status.in-active");
		default:
			return "Unknown";
	}
};

export const getStatusOptions = (t: TFunction) => {
	return [
		{ value: Status.Active.toString(), label: t("message.status.active") },
		{ value: Status.Inactive.toString(), label: t("message.status.in-active") },
	];
};

export const getStatusBadgeVariant = (status: number): BadgeVariant => {
	return StatusBadgeVariant[status as Status] || "gray";
};
