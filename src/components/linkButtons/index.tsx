export enum LinkType {
    CALENDAR = "CALENDAR",
}

export const LinkButton = (props: {
    type: LinkType,
    extraClasses?: string,
}) => {
    const {type, extraClasses = "", ...rest} = props;

    let icon;
    let label;
    switch (type) {
        case LinkType.CALENDAR:
            icon = "/images/blue-calendar.svg";
            label = "Add to calendar";
            break;
    }

    return (
        <button 
            className={`text-blue flex inline-flex items-center space-x-2 ${extraClasses}`} 
            {...rest}
        >
            <img
                src={icon}
                alt=""
                className=""
            />
            <div>{label}</div>
        </button>
    );
}