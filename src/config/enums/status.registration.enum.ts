export enum StatusRegistration {
	Rpl = "rpl",
	NonRpl = "non-rpl",
	Unknown = "unknown",
}

export const StatusRegistrationLabel: Record<StatusRegistration, string> = {
	[StatusRegistration.Rpl]: "RPL",
	[StatusRegistration.NonRpl]: "Non RPL",
	[StatusRegistration.Unknown]: "Tidak Diketahui",
};

export const getReligionOptions = () => {
	return Object.entries(StatusRegistrationLabel).map(([value, label]) => ({
		value,
		label,
	}));
};

export const getReligionLabel = (value: string): string => {
	return StatusRegistrationLabel[value as StatusRegistration] || value;
};
