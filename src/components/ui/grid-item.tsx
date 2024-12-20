interface GridItemProps {
	label: string;
	value: string | number;
	fullWidth?: boolean;
}

export function GridItem({ label, value, fullWidth = false }: GridItemProps) {
	return (
		<div className={`space-y-2 ${fullWidth ? "md:col-span-2" : ""}`}>
			<label className="text-sm text-muted-foreground block">{label}</label>
			<p className="font-semibold">{value}</p>
		</div>
	);
}
