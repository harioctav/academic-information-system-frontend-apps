import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputProps } from "@/types/common";
import { useTranslations } from "next-intl";

export const EmailInput = ({
	value,
	onChange,
	error,
	disabled,
}: InputProps) => {
	const t = useTranslations();

	return (
		<div className="space-y-2">
			<Label htmlFor="email" className="block text-sm font-medium mb-2">
				{t("input.user.email.label")}
			</Label>
			<Input
				type="email"
				id="email"
				name="email"
				placeholder={t("input.user.email.placeholder")}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full"
				disabled={disabled}
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};
