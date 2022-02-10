import DatePicker from "react-datepicker";


export enum TokenType {
    USDC = "USDC",
}

export const InputFieldWithDate = (props: {
    selectedDate?: Date,
    placeholderLabel?: string,
    infoLabel?: string,
    extraClasses?: string,
    onChange: (date: Date | null) => void,
}) => {
    const {
        selectedDate, 
        placeholderLabel = "Choose date", 
        infoLabel, 
        extraClasses = "", 
        onChange
    } = props;

    return (
        <>
            <div className="relative">
                <DatePicker
                    minDate={new Date()}
                    popperProps={{
                        positionFixed: true, // use this to make the popper position: fixed
                    }}
                    closeOnScroll={(e) => e.target === document}
                    selected={selectedDate}
                    onChange={onChange}
                    todayButton="Go to Today"
                    dateFormat="MMMM d, yyyy"
                    formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
                    showPopperArrow={false}
                    dropdownMode="select"
                    placeholderText={placeholderLabel}
                    className={`focus:border-blue-navy hover:border-gray-syn3 border-gray-24 transition-all ${extraClasses}`}
                />
            </div>
            {infoLabel && 
                <div className={`text-sm mt-2 text-gray-syn2`}>{infoLabel}</div>
            }
        </>
    );
}
