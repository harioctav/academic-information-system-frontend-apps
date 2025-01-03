import { BadgeVariant } from "@/components/ui/badge";

export enum RecommendationNote {
	SemesterBerjalan = "semester_berjalan",
	Direkomendasikan = "direkomendasikan",
	PerluPerbaikan = "perlu_perbaikan",
	DalamPerbaikan = "dalam_perbaikan",
	SudahDiperbaiki = "sudah_diperbaiki",
	RequestPerbaikan = "permintaan_perbaikan",
	Lulus = "lulus",
	Submitted = "submit_ke_web_universitas_terbuka",
}

export const RecommendationNoteLabel: Record<RecommendationNote, string> = {
	[RecommendationNote.SemesterBerjalan]: "Semester Berjalan",
	[RecommendationNote.Direkomendasikan]: "Direkomendasikan",
	[RecommendationNote.PerluPerbaikan]: "Perlu Perbaikan",
	[RecommendationNote.DalamPerbaikan]: "Dalam Perbaikan",
	[RecommendationNote.SudahDiperbaiki]: "Sudah Diperbaiki",
	[RecommendationNote.RequestPerbaikan]: "Permintaan Perbaikan",
	[RecommendationNote.Lulus]: "Lulus",
	[RecommendationNote.Submitted]: "Sudah Di Submit",
};

export const RecommendationNoteBadgeVariants: Record<
	RecommendationNote,
	BadgeVariant
> = {
	[RecommendationNote.SemesterBerjalan]: "blue",
	[RecommendationNote.Direkomendasikan]: "green",
	[RecommendationNote.PerluPerbaikan]: "yellow",
	[RecommendationNote.DalamPerbaikan]: "indigo",
	[RecommendationNote.SudahDiperbaiki]: "green",
	[RecommendationNote.RequestPerbaikan]: "red",
	[RecommendationNote.Lulus]: "green",
	[RecommendationNote.Submitted]: "purple",
};

export const getRecommendationNoteBadgeVariant = (
	note: string
): BadgeVariant => {
	return RecommendationNoteBadgeVariants[note as RecommendationNote] || "gray";
};

export const getRecommendationNoteOptions = () => {
	return Object.entries(RecommendationNoteLabel).map(([value, label]) => ({
		value,
		label,
	}));
};

export const getRecommendationNoteLabel = (value: string): string => {
	return RecommendationNoteLabel[value as RecommendationNote] || value;
};
