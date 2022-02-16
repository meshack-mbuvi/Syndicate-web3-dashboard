export enum SwitchType {
    REGULAR = "REGULAR",
    EXPLICIT = "EXPLICIT",
}


export const Switch = (props: {
    isOn: boolean,
    type?: SwitchType,
    extraClasses?: string,
    onClick: () => void
}) => {
    const {
        isOn = true, 
        type = SwitchType.REGULAR,
        extraClasses = "", 
        onClick = () => false
    } = props;

    return (
        <button 
            className={`${isOn ? "bg-blue-500" : "bg-gray-5"} rounded-full cursor-pointer transition-all ${extraClasses}`} 
            style={{
                width: "3rem", 
                height: "1.7rem", 
                padding: "0.14375rem"
            }}
            onClick={onClick}
        >
            {/* Circle knob */}
            <div 
                className="rounded-full bg-white transition-all duration-500"
                style={{
                    height: "1.41rem", 
                    width: "1.41rem", 
                    transform: `translateX(${isOn ? "92%" : "0%"})`
                }}
            >
                {/* Icon */}
                {type === SwitchType.EXPLICIT && 
                    <img 
                        src={`/images/${isOn ? "checkmark-blue" : "xmark-gray"}.svg`} 
                        alt="extenal-link"
                        className="mx-auto vertically-center"
                    />
                }
            </div>
        </button>
    );
}