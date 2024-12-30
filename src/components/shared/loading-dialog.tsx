import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LoadingDialogProps {
	isOpen: boolean;
}

export function LoadingDialog({ isOpen }: LoadingDialogProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px] [&>button]:hidden">
				<DialogTitle className="sr-only">Loading Status</DialogTitle>
				<LoadingSpinner />
			</DialogContent>
		</Dialog>
	);
}
