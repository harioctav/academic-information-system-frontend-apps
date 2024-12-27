import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

export enum AddressType {
	Domicile = "domicile",
	IdCard = "id_card",
}

export const getAddressTypeLabel = (
	address_type: string,
	t: TFunction
): string => {
	switch (address_type) {
		case AddressType.Domicile:
			return t("message.address_type.domicile");
		case AddressType.IdCard:
			return t("message.address_type.id_card");
		default:
			return t("message.gender.unknown");
	}
};

export const getAddressTypeOptions = (t: TFunction) => {
	return [
		{
			value: AddressType.Domicile.toString(),
			label: t("message.address_type.domicile"),
		},
		{
			value: AddressType.IdCard.toString(),
			label: t("message.address_type.id_card"),
		},
	];
};
