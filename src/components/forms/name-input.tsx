import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputProps } from "@/types/common";
import { useTranslations } from "next-intl";

export const NameInput = ({ value, onChange, error, disabled }: InputProps) => {
	const t = useTranslations();

	return (
		<div className="space-y-2">
			<Label htmlFor="name" className="block text-sm font-medium mb-2">
				{t("input.common.name.label")}
			</Label>
			<Input
				type="text"
				id="name"
				name="name"
				placeholder={t("input.common.name.placeholder")}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full"
				disabled={disabled}
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};
