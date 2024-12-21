interface GridItemProps {
	label: string;
	value: string | number;
	fullWidth?: boolean;
	className?: string;
}

export function GridItem({
	label,
	value,
	fullWidth = false,
	className = "",
}: GridItemProps) {
	return (
		<div
			className={`space-y-2 ${fullWidth ? "md:col-span-2" : ""} ${className}`}
		>
			<label className="text-sm text-muted-foreground block">{label}</label>
			<p className="font-semibold">{value}</p>
		</div>
	);
}