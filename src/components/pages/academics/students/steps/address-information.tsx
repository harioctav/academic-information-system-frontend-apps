import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { Label } from "@/components/ui/label";
import { StudentRequest } from "@/types/academics/student";
import { useTranslations } from "next-intl";
import { AddressType } from "@/config/enums/address.type.enum";
import { DynamicTextarea } from "@/components/forms/dynamic-textarea";
import { Province } from "@/types/locations/province";
import { Regency } from "@/types/locations/regency";
import { District } from "@/types/locations/district";
import { Village } from "@/types/locations/village";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AddressInformationStepProps {
	formData: StudentRequest;
	setFormData: (data: StudentRequest) => void;
	errors: Record<string, string[]>;
	isLoading: boolean;
}

const AddressInformationStep = ({
	formData,
	setFormData,
	errors,
	isLoading,
}: AddressInformationStepProps) => {
	const t = useTranslations();

	// Domicile states
	const [selectedDomicileProvince, setSelectedDomicileProvince] =
		useState<SelectOption<Province> | null>(null);
	const [selectedDomicileRegency, setSelectedDomicileRegency] =
		useState<SelectOption<Regency> | null>(null);
	const [selectedDomicileDistrict, setSelectedDomicileDistrict] =
		useState<SelectOption<District> | null>(null);
	const [selectedDomicileVillage, setSelectedDomicileVillage] =
		useState<SelectOption<Village> | null>(null);

	// ID Card states
	const [selectedIdCardProvince, setSelectedIdCardProvince] =
		useState<SelectOption<Province> | null>(null);
	const [selectedIdCardRegency, setSelectedIdCardRegency] =
		useState<SelectOption<Regency> | null>(null);
	const [selectedIdCardDistrict, setSelectedIdCardDistrict] =
		useState<SelectOption<District> | null>(null);
	const [selectedIdCardVillage, setSelectedIdCardVillage] =
		useState<SelectOption<Village> | null>(null);

	const updateAddress = (
		type: AddressType,
		data: Partial<(typeof formData.addresses)[0]>
	) => {
		const addresses = [...formData.addresses];
		const index = addresses.findIndex((addr) => addr.type === type);

		if (index >= 0) {
			addresses[index] = { ...addresses[index], ...data };
		} else {
			addresses.push({ type, ...data } as (typeof formData.addresses)[0]);
		}

		setFormData({ ...formData, addresses });
	};

	return (
		<div className="space-y-8">
			{/* Domicile Address */}
			<div className="space-y-4">
				<div>
					<h6 className="text-md font-medium">
						{t("input.location.address.type.domicile.label")}
					</h6>
					<p className="text-sm text-muted-foreground">
						{t("input.location.address.type.domicile.placeholder")}
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label>{t("input.location.province.label")}</Label>
						<AsyncSelectInput<Province>
							placeholder={t("input.select")}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/selects/provinces`}
							value={selectedDomicileProvince}
							onChange={(newValue) => {
								setSelectedDomicileProvince(newValue);
								// Clear child selections and their options
								setSelectedDomicileRegency(null);
								setSelectedDomicileDistrict(null);
								setSelectedDomicileVillage(null);
								updateAddress(AddressType.Domicile, {
									province_id: newValue?.data.id || 0,
									regency_id: 0,
									district_id: 0,
									village_id: 0,
								});
							}}
							key={`province-${selectedDomicileProvince?.data.id || "empty"}`}
							textFormatter={(item) => item.name}
							valueFormatter={(item) => item.id}
							isClearable
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.regency.label")}</Label>
						<AsyncSelectInput<Regency>
							placeholder={t("input.select")}
							apiUrl={`${
								process.env.NEXT_PUBLIC_API_URL
							}/options/selects/regencies?province_id=${
								selectedDomicileProvince?.data.id || ""
							}`}
							value={selectedDomicileRegency}
							key={`regency-${selectedDomicileProvince?.data.id || "empty"}`}
							onChange={(newValue) => {
								setSelectedDomicileRegency(newValue);
								setSelectedDomicileDistrict(null);
								setSelectedDomicileVillage(null);
								updateAddress(AddressType.Domicile, {
									regency_id: newValue?.data.id || 0,
									district_id: 0,
									village_id: 0,
								});
							}}
							textFormatter={(item) => `${item.type} ${item.name}`}
							valueFormatter={(item) => item.id}
							isClearable
							isDisabled={!selectedDomicileProvince}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.district.label")}</Label>
						<AsyncSelectInput<District>
							placeholder={t("input.select")}
							apiUrl={`${
								process.env.NEXT_PUBLIC_API_URL
							}/options/selects/districts?regency_id=${
								selectedDomicileRegency?.data.id || ""
							}`}
							value={selectedDomicileDistrict}
							key={`district-${selectedDomicileRegency?.data.id || "empty"}`}
							onChange={(newValue) => {
								setSelectedDomicileDistrict(newValue);
								setSelectedDomicileVillage(null);
								updateAddress(AddressType.Domicile, {
									district_id: newValue?.data.id || 0,
									village_id: 0,
								});
							}}
							textFormatter={(item) => item.name}
							valueFormatter={(item) => item.id}
							isClearable
							isDisabled={!selectedDomicileRegency}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.village.label")}</Label>
						<AsyncSelectInput<Village>
							placeholder={t("input.select")}
							apiUrl={`${
								process.env.NEXT_PUBLIC_API_URL
							}/options/selects/villages?district_id=${
								selectedDomicileDistrict?.data.id || ""
							}`}
							value={selectedDomicileVillage}
							key={`village-${selectedDomicileDistrict?.data.id || "empty"}`}
							onChange={(newValue) => {
								setSelectedDomicileVillage(newValue);
								updateAddress(AddressType.Domicile, {
									village_id: newValue?.data.id || 0,
								});
							}}
							textFormatter={(item) => item.name}
							valueFormatter={(item) => item.id}
							isClearable
							isDisabled={!selectedDomicileDistrict}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.pos_code.label")}</Label>
						<Input
							value={selectedDomicileVillage?.data.pos_code || ""}
							disabled
						/>
					</div>

					<div className="col-span-full">
						<DynamicTextarea
							name="domicile_address"
							label={t("input.location.address.label")}
							value={
								formData.addresses.find(
									(addr) => addr.type === AddressType.Domicile
								)?.address || ""
							}
							onChange={(value) =>
								updateAddress(AddressType.Domicile, { address: value })
							}
							error={errors["addresses.domicile.address"]?.[0]}
							disabled={isLoading}
							rows={4}
						/>
					</div>
				</div>
			</div>

			{/* ID Card Address */}
			<div className="space-y-4">
				<div>
					<h6 className="text-md font-medium">
						{t("input.location.address.type.id_card.label")}
					</h6>
					<p className="text-sm text-muted-foreground">
						{t("input.location.address.type.id_card.placeholder")}
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label>{t("input.location.province.label")}</Label>
						<AsyncSelectInput<Province>
							placeholder={t("input.select")}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/selects/provinces`}
							value={selectedIdCardProvince}
							key={`id-card-province-${
								selectedIdCardProvince?.data.id || "empty"
							}`}
							onChange={(newValue) => {
								setSelectedIdCardProvince(newValue);
								setSelectedIdCardRegency(null);
								setSelectedIdCardDistrict(null);
								setSelectedIdCardVillage(null);
								updateAddress(AddressType.IdCard, {
									province_id: newValue?.data.id || 0,
									regency_id: 0,
									district_id: 0,
									village_id: 0,
								});
							}}
							textFormatter={(item) => item.name}
							valueFormatter={(item) => item.id}
							isClearable
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.regency.label")}</Label>
						<AsyncSelectInput<Regency>
							placeholder={t("input.select")}
							apiUrl={`${
								process.env.NEXT_PUBLIC_API_URL
							}/options/selects/regencies?province_id=${
								selectedIdCardProvince?.data.id || ""
							}`}
							value={selectedIdCardRegency}
							key={`id-card-regency-${
								selectedIdCardProvince?.data.id || "empty"
							}`}
							onChange={(newValue) => {
								setSelectedIdCardRegency(newValue);
								setSelectedIdCardDistrict(null);
								setSelectedIdCardVillage(null);
								updateAddress(AddressType.IdCard, {
									regency_id: newValue?.data.id || 0,
									district_id: 0,
									village_id: 0,
								});
							}}
							textFormatter={(item) => `${item.type} ${item.name}`}
							valueFormatter={(item) => item.id}
							isClearable
							isDisabled={!selectedIdCardProvince}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.district.label")}</Label>
						<AsyncSelectInput<District>
							placeholder={t("input.select")}
							apiUrl={`${
								process.env.NEXT_PUBLIC_API_URL
							}/options/selects/districts?regency_id=${
								selectedIdCardRegency?.data.id || ""
							}`}
							value={selectedIdCardDistrict}
							key={`id-card-district-${
								selectedIdCardRegency?.data.id || "empty"
							}`}
							onChange={(newValue) => {
								setSelectedIdCardDistrict(newValue);
								setSelectedIdCardVillage(null);
								updateAddress(AddressType.IdCard, {
									district_id: newValue?.data.id || 0,
									village_id: 0,
								});
							}}
							textFormatter={(item) => item.name}
							valueFormatter={(item) => item.id}
							isClearable
							isDisabled={!selectedIdCardRegency}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.village.label")}</Label>
						<AsyncSelectInput<Village>
							placeholder={t("input.select")}
							apiUrl={`${
								process.env.NEXT_PUBLIC_API_URL
							}/options/selects/villages?district_id=${
								selectedIdCardDistrict?.data.id || ""
							}`}
							value={selectedIdCardVillage}
							key={`id-card-village-${
								selectedIdCardDistrict?.data.id || "empty"
							}`}
							onChange={(newValue) => {
								setSelectedIdCardVillage(newValue);
								updateAddress(AddressType.IdCard, {
									village_id: newValue?.data.id || 0,
								});
							}}
							textFormatter={(item) => item.name}
							valueFormatter={(item) => item.id}
							isClearable
							isDisabled={!selectedIdCardDistrict}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("input.location.pos_code.label")}</Label>
						<Input
							value={selectedIdCardVillage?.data.pos_code || ""}
							disabled
						/>
					</div>

					<div className="col-span-full">
						<DynamicTextarea
							name="id_card_address"
							label={t("input.location.address.label")}
							value={
								formData.addresses.find(
									(addr) => addr.type === AddressType.IdCard
								)?.address || ""
							}
							onChange={(value) =>
								updateAddress(AddressType.IdCard, { address: value })
							}
							error={errors["addresses.id_card.address"]?.[0]}
							disabled={isLoading}
							rows={4}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddressInformationStep;
