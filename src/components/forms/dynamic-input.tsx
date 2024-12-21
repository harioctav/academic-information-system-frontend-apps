import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputProps } from "@/types/common";
import { useTranslations } from "next-intl";

interface DynamicInputProps extends InputProps {
	type: "text" | "number" | "email" | "tel" | "password";
	name: string;
	label: string;
	placeholder?: string;
	min?: number;
	max?: number;
	step?: number | "any";
}

export const DynamicInput = ({
	type,
	name,
	label,
	placeholder,
	value,
	onChange,
	error,
	disabled,
	min,
	max,
	step,
}: DynamicInputProps) => {
	const t = useTranslations();

	return (
		<div className="space-y-2">
			<Label htmlFor={name} className="block text-sm font-medium mb-2">
				{label}
			</Label>
			<Input
				type={type}
				id={name}
				name={name}
				placeholder={
					placeholder || t("input.common.placeholder", { field: label })
				}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full"
				disabled={disabled}
				min={min}
				max={max}
				step={step}
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};
