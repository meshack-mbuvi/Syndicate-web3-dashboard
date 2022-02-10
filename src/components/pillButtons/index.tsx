export const PillButton = (props: {
    isActive?: boolean,
    extraClasses?: string,
    children: any,
}) => {
    const {isActive = false, extraClasses = "", children, ...rest} = props;
    const activeClasses = "ring-1 ring-blue-navy";

    return (
        <div 
            className={`inline-flex flex flex-row items-center space-x-1 text-sm px-4 py-1.5 bg-gray-syn7 rounded-full text-center text-gray-syn4 hover:ring-1 hover:ring-blue-navy ${isActive && activeClasses} ${extraClasses}`} 
            {...rest}
        >
            {children}
        </div>
    );
}