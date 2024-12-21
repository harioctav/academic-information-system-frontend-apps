import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputProps } from "@/types/common";
import { useTranslations } from "next-intl";

export const PhoneInput = ({
	value,
	onChange,
	error,
	disabled,
}: InputProps) => {
	const t = useTranslations();

	const handlePhoneChange = (inputValue: string) => {
		// Remove any existing "62" prefix first
		const cleanNumber = inputValue.replace(/^62/, "");

		if (cleanNumber.startsWith("0")) {
			// If starts with 0, replace with 62
			onChange("62" + cleanNumber.slice(1));
		} else {
			// For all other cases, add 62 prefix
			onChange("62" + cleanNumber);
		}
	};

	// Display value without 62 prefix
	const displayValue = value?.replace(/^62/, "") || "";

	return (
		<div className="space-y-2">
			<Label htmlFor="phone" className="block text-sm font-medium mb-2">
				{t("input.user.phone.label")}
			</Label>
			<div className="flex gap-2">
				<div className="flex items-center px-3 bg-muted rounded-md">+62</div>
				<Input
					type="tel"
					id="phone"
					name="phone"
					placeholder={t("input.user.phone.placeholder")}
					value={displayValue}
					onChange={(e) => handlePhoneChange(e.target.value)}
					className="w-full"
					disabled={disabled}
				/>
			</div>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};
