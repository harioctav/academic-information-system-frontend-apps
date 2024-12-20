export enum DegreeType {
	DiplomaTiga = "d3",
	DiplomaEmpat = "d4",
	Sarjana = "s1",
	Magister = "s2",
}

export const DegreeTypeLabel: Record<DegreeType, string> = {
	[DegreeType.DiplomaTiga]: "Diploma 3 - D3",
	[DegreeType.DiplomaEmpat]: "Diploma 4 - D4",
	[DegreeType.Sarjana]: "Sarjana - S1",
	[DegreeType.Magister]: "Magister - S2",
};

export const getDegreeOptions = () => {
	return Object.entries(DegreeTypeLabel).map(([value, label]) => ({
		value,
		label,
	}));
};

export const getDegreeLabel = (value: string): string => {
	return DegreeTypeLabel[value as DegreeType] || value;
};
