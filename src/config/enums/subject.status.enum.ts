export enum SubjectStatus {
	Inti = "I",
	NonInti = "N",
}

export const SubjectStatusLabel: Record<SubjectStatus, string> = {
	[SubjectStatus.Inti]: "Inti",
	[SubjectStatus.NonInti]: "Non Inti",
};

export const getSubjectStatusOptions = () => {
	return Object.entries(SubjectStatusLabel).map(([value, label]) => ({
		value,
		label,
	}));
};

export const getSubjectStatusLabel = (value: string): string => {
	return SubjectStatusLabel[value as SubjectStatus] || value;
};
