interface ListContainerProps {
	children: React.ReactNode;
}

const ListContainer = ({ children }: ListContainerProps) => {
	return (
		<ul className="divide-y divide-gray-200 border rounded-lg">{children}</ul>
	);
};

export default ListContainer;
