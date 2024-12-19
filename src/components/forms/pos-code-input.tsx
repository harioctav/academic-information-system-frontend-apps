import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PosCodeInputProps } from "@/types/common";
import { useTranslations } from "next-intl";

export const PosCodeInput = ({
	value,
	onChange,
	error,
	disabled,
}: PosCodeInputProps) => {
	const t = useTranslations();

	return (
		<div className="space-y-2">
			<Label htmlFor="pos_code" className="block text-sm font-medium mb-2">
				{t("input.location.pos_code.label")}
			</Label>
			<Input
				type="number"
				min="0"
				id="pos_code"
				name="pos_code"
				placeholder={t("input.location.pos_code.placeholder")}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full"
				disabled={disabled}
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};
