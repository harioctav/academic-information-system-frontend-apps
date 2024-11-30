import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageBreadcrumbProps {
	items?: {
		href?: string;
		label: string;
	}[];
	currentPage: string;
}

export function PageBreadcrumb({
	items = [],
	currentPage,
}: PageBreadcrumbProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => (
					<>
						<BreadcrumbItem key={`item-${index}`} className="hidden md:block">
							<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator
							key={`separator-${index}`}
							className="hidden md:block"
						/>
					</>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage>{currentPage}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
