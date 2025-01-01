interface GridItemProps {
	label: string | React.ReactNode;
	value: string | number | React.ReactNode;
	fullWidth?: boolean;
	className?: string;
	reversed?: boolean;
}

export function GridItem({
	label,
	value,
	fullWidth = false,
	className = "",
	reversed = false,
}: GridItemProps) {
	return (
		<div className={`${fullWidth ? "md:col-span-2" : ""} ${className}`}>
			{reversed ? (
				<>
					<div className="font-semibold break-words overflow-wrap-anywhere">
						{value}
					</div>
					<label className="text-sm text-muted-foreground block">{label}</label>
				</>
			) : (
				<>
					<label className="text-sm text-muted-foreground block">{label}</label>
					<div className="break-words overflow-wrap-anywhere">{value}</div>
				</>
			)}
		</div>
	);
}
