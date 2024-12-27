export enum ReligionType {
	Islam = "islam",
	Chatolic = "katolik",
	Christian = "kristen",
	Hindu = "hindu",
	Buddha = "buddha",
	Unknown = "unknown",
}

export const ReligionTypeLabel: Record<ReligionType, string> = {
	[ReligionType.Islam]: "Islam",
	[ReligionType.Chatolic]: "Katolik",
	[ReligionType.Christian]: "Kristen",
	[ReligionType.Hindu]: "Hindu",
	[ReligionType.Buddha]: "Buddha",
	[ReligionType.Unknown]: "Tidak Diketahui",
};

export const getReligionOptions = () => {
	return Object.entries(ReligionTypeLabel).map(([value, label]) => ({
		value,
		label,
	}));
};

export const getReligionLabel = (value: string): string => {
	return ReligionTypeLabel[value as ReligionType] || value;
};
