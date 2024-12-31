"use client";

import Select from "react-select";

interface SelectOption {
	value: string;
	label: string;
}

interface DynamicSelectRSProps {
	value: string | undefined;
	onChange: (value: string | undefined) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
	error?: string;
	disabled?: boolean;
}

export function DynamicSelectRS({
	value,
	onChange,
	options,
	placeholder = "Select Option",
	className,
	disabled,
}: DynamicSelectRSProps) {
	const selectedOption = options.find((option) => option.value === value);

	const handleChange = (option: SelectOption | null) => {
		onChange(option?.value);
	};

	return (
		<div className={className}>
			<Select
				value={selectedOption}
				onChange={handleChange}
				options={options}
				placeholder={placeholder}
				isDisabled={disabled}
				isClearable={true}
				classNamePrefix="react-select"
				styles={{
					control: (base, state) => ({
						...base,
						minHeight: "36px",
						fontSize: "14px",
						backgroundColor: "hsl(var(--background))",
						borderColor: state.isFocused
							? "hsl(var(--ring))"
							: "hsl(var(--input))",
						borderRadius: "calc(var(--radius) - 2px)",
						boxShadow: state.isFocused
							? "0 0 0 calc(1px) hsl(var(--ring) / 0.2)"
							: "none",
						"&:hover": {
							borderColor: "hsl(var(--input))",
						},
					}),
					valueContainer: (base) => ({
						...base,
						padding: "0 8px",
						gap: "4px",
					}),
					input: (base) => ({
						...base,
						color: "hsl(var(--foreground))",
						margin: 0,
						padding: 0,
						fontSize: "14px",
					}),
					placeholder: (base) => ({
						...base,
						color: "hsl(var(--muted-foreground))",
						opacity: 0.7,
						fontSize: "14px",
					}),
					menu: (base) => ({
						...base,
						backgroundColor: "hsl(var(--background))",
						border: "1px solid hsl(var(--input))",
					}),
					menuList: (base) => ({
						...base,
						backgroundColor: "hsl(var(--background))",
					}),
					singleValue: (base) => ({
						...base,
						color: "hsl(var(--foreground))",
					}),
					option: (base, state) => ({
						...base,
						fontSize: "14px",
						padding: "8px",
						backgroundColor: state.isFocused
							? "hsl(var(--accent))"
							: "transparent",
						color: state.isFocused
							? "hsl(var(--accent-foreground))"
							: "hsl(var(--foreground))",
					}),
					noOptionsMessage: (base) => ({
						...base,
						fontSize: "14px",
						color: "hsl(var(--muted-foreground))",
					}),
					loadingMessage: (base) => ({
						...base,
						fontSize: "14px",
						color: "hsl(var(--muted-foreground))",
					}),
					multiValue: (base) => ({
						...base,
						backgroundColor: "hsl(var(--accent))",
						borderRadius: "calc(var(--radius) - 4px)",
					}),
					multiValueLabel: (base) => ({
						...base,
						color: "hsl(var(--accent-foreground))",
						padding: "2px 6px",
					}),
					multiValueRemove: (base) => ({
						...base,
						color: "hsl(var(--accent-foreground))",
						"&:hover": {
							backgroundColor: "hsl(var(--destructive))",
							color: "hsl(var(--destructive-foreground))",
						},
					}),
				}}
			/>
		</div>
	);
}
