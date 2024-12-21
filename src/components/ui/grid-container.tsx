interface GridContainerProps {
	children: React.ReactNode;
	className?: string;
}

export function GridContainer({
	children,
	className = "",
}: GridContainerProps) {
	return (
		<div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
			{children}
		</div>
	);
}
