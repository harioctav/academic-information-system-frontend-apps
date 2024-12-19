import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputProps } from "@/types/common";
import { useTranslations } from "next-intl";

export const PhoneInput = ({
	value,
	onChange,
	error,
	disabled,
}: PhoneInputProps) => {
	const t = useTranslations();

	return (
		<div className="space-y-2">
			<Label htmlFor="phone" className="block text-sm font-medium mb-2">
				{t("input.user.phone.label")}
			</Label>
			<Input
				type="tel"
				id="phone"
				name="phone"
				placeholder={t("input.user.phone.placeholder")}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full"
				disabled={disabled}
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};
