"use client";

import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { ActionMeta, SingleValue, GroupBase } from "react-select";

interface Option {
	value: string | number;
	label: string;
	data: any;
}

interface AsyncSelectProps {
	placeholder?: string;
	apiUrl: string;
	value?: Option | null;
	onChange?: (
		newValue: SingleValue<Option>,
		actionMeta: ActionMeta<Option>
	) => void;
	onClear?: () => void;
	textFormatter: (item: any) => string;
	isClearable?: boolean;
}

export function AsyncSelectInput({
	placeholder,
	apiUrl,
	value,
	onChange,
	onClear,
	textFormatter,
	isClearable = true,
}: AsyncSelectProps) {
	const loadOptions: LoadOptions<
		Option,
		GroupBase<Option>,
		{ page: number }
	> = async (search, _, additional) => {
		const token = document.cookie.split("token=")[1]?.split(";")[0];
		const currentPage = additional?.page || 1;

		const response = await fetch(
			`${apiUrl}?search=${search}&page=${currentPage}&per_page=30`,
			{
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			}
		);

		const data = await response.json();
		const options = data.data.map((item: any) => ({
			value: item.id,
			label: textFormatter(item),
			data: item,
		}));

		return {
			options,
			hasMore: data.meta.current_page < data.meta.last_page,
			additional: {
				page: currentPage + 1,
			},
		};
	};

	const handleChange = (
		newValue: SingleValue<Option>,
		actionMeta: ActionMeta<Option>
	) => {
		if (actionMeta.action === "clear" && onClear) {
			onClear();
		}
		if (onChange) {
			onChange(newValue, actionMeta);
		}
	};

	return (
		<AsyncPaginate
			value={value}
			loadOptions={loadOptions}
			onChange={handleChange}
			isClearable={isClearable}
			placeholder={placeholder}
			classNamePrefix="react-select"
			additional={{
				page: 1,
			}}
			debounceTimeout={300}
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
					padding: "6px 8px",
					borderRadius: "calc(var(--radius) - 4px)",
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
	);
}
