export enum Semester {
	One = 1,
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5,
	Six = 6,
	Seven = 7,
	Eight = 8,
}

export const SemesterLabel: Record<Semester, string> = {
	[Semester.One]: "Semester 1",
	[Semester.Two]: "Semester 2",
	[Semester.Three]: "Semester 3",
	[Semester.Four]: "Semester 4",
	[Semester.Five]: "Semester 5",
	[Semester.Six]: "Semester 6",
	[Semester.Seven]: "Semester 7",
	[Semester.Eight]: "Semester 8",
};

export const getSemesterOptions = () => {
	return Object.values(Semester)
		.filter((value) => !isNaN(Number(value)))
		.map((value) => ({
			value: value.toString(),
			label: SemesterLabel[value as Semester],
		}));
};

export const getSemesterLabel = (semester?: Semester) => {
	if (!semester) return "-";
	return SemesterLabel[semester];
};
