interface FormatterProps {
	mainText: string;
	subText: string;
}

export const CustomFormatter = ({ mainText, subText }: FormatterProps) => (
	<div className="flex flex-col">
		<span>{mainText}</span>
		<span className="text-muted-foreground text-sm">{subText}</span>
	</div>
);
