export const Callout = (props: {
    extraClasses: string,
    children: any
}) => {
    const {extraClasses = "", children} = props;

    return (
        <div className={`rounded-xl bg-blue-navy bg-opacity-20 text-blue-navy items-center p-4 ${extraClasses}`}>
            {children}
        </div>
    );
}