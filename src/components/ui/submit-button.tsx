import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends ButtonProps {
	isLoading?: boolean;
	children: React.ReactNode;
}

export function SubmitButton({
	isLoading = false,
	children,
	...props
}: SubmitButtonProps) {
	return (
		<Button disabled={isLoading} {...props}>
			{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{children}
		</Button>
	);
}
