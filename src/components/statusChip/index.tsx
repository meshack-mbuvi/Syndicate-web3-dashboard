export enum ChipState {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    ACTION_REQUIRED = "ACTION_REQUIRED"
}

export const StatusChip = (props: {
    status: ChipState,
    extraClasses: string,
}) => {
    const {
        status,
        extraClasses = ""
    } = props;

    let bgStyles = "";
    let label = "";
    let dotStyles = "";
    switch (status) {
        case ChipState.PENDING:
            bgStyles = "bg-white bg-opacity-10";
            label = "Pending approval";
            dotStyles = "border border-gray-syn3";
            break;
        case ChipState.SUCCESS:
            bgStyles = "bg-green bg-opacity-25";
            label = "Complete";
            dotStyles = "bg-green";
            break;
        case ChipState.ACTION_REQUIRED:
            bgStyles = "bg-white bg-blue-500 bg-opacity-40";
            label = "Action required";
            dotStyles = "bg-blue-500";
            break;
    }

    return (
        <div 
            className={`${bgStyles} inline-flex items-center space-x-2 rounded-full pl-3 pr-4 ${extraClasses}`}
            style={{padding: "0.3125rem 0.75rem"}}
        >
            <div className={`${dotStyles} w-2 h-2 rounded-full`}></div>
            <div className={`text-sm`}>{label}</div>
        </div>
    );
}