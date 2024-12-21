import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

interface CheckboxGroupProps {
	label: string;
	options: Record<string, string>;
	value: string[];
	onChange: (value: string[]) => void;
	disabled?: boolean;
}

export const CheckboxGroup = ({
	label,
	options,
	value,
	onChange,
	disabled,
}: CheckboxGroupProps) => {
	const t = useTranslations();

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			onChange(Object.values(options));
		} else {
			onChange([]);
		}
	};

	return (
		<div className="space-y-4">
			<Label className="text-sm font-medium">{label}</Label>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-2">
					<Switch
						id="select-all"
						checked={value.length === Object.values(options).length}
						onCheckedChange={handleSelectAll}
						disabled={disabled}
					/>
					<Label htmlFor="select-all" className="text-sm font-medium">
						{t("input.select-all")}
					</Label>
				</div>
			</div>

			<div className="flex flex-wrap gap-4">
				{Object.entries(options).map(([key, option]) => (
					<div key={key} className="flex items-center space-x-2">
						<Checkbox
							id={`option-${key}`}
							checked={value.includes(option)}
							onCheckedChange={(checked) => {
								if (checked) {
									onChange([...value, option]);
								} else {
									onChange(value.filter((v) => v !== option));
								}
							}}
							disabled={disabled}
						/>
						<Label
							htmlFor={`option-${key}`}
							className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{option}
						</Label>
					</div>
				))}
			</div>
		</div>
	);
};
