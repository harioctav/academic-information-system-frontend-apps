import { XCircle } from "lucide-react";

export const Forbidden = ({ message }: { message?: string }) => {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center">
			<XCircle className="h-16 w-16 text-red-500 mb-4" />
			<h3 className="text-lg font-semibold">Access Denied</h3>
			<p className="text-muted-foreground mt-2">
				{message || "You don't have permission to access this resource"}
			</p>
		</div>
	);
};
