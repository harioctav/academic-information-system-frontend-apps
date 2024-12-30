import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

export enum GenderType {
	Male = "male",
	Female = "female",
	Unknown = "unknown",
}

export const getGenderTypeLabel = (gender: string, t: TFunction): string => {
	switch (gender) {
		case GenderType.Male:
			return t("message.gender.male");
		case GenderType.Female:
			return t("message.gender.female");
		default:
			return "-";
	}
};

export const getGenderTypeOptions = (t: TFunction) => {
	return [
		{ value: GenderType.Male.toString(), label: t("message.gender.male") },
		{ value: GenderType.Female.toString(), label: t("message.gender.female") },
		{
			value: GenderType.Unknown.toString(),
			label: t("message.gender.unknown"),
		},
	];
};
