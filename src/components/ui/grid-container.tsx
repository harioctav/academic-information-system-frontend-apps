interface GridContainerProps {
	children: React.ReactNode;
}

export function GridContainer({ children }: GridContainerProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
	);
}
