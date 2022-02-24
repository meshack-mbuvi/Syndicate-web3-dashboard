export const InputField = (props: {
    value?: string,
    placeholderLabel?: string,
    infoLabel?: string,
    isInErrorState?: boolean,
    extraClasses?: string,
    onChange?: (e) => void,
}) => {
    const {
        value, 
        placeholderLabel, 
        infoLabel, 
        isInErrorState = false,
        extraClasses = "", 
        onChange,
        ...rest
    } = props;

    return (
        <>
            <input 
                className={`block font-whyte text-base bg-transparent p-4 rounded-md border-1 w-full ${isInErrorState ? "border-red-error" : "border-gray-24"} focus:border-blue-navy outline-none text-white hover:border-gray-syn3 ${extraClasses}`}
                placeholder={placeholderLabel}
                value={value}
                onChange={onChange}
                {...rest}
                
            />
            {infoLabel && 
                <div className={`text-sm mt-2 ${isInErrorState ? "text-red-error" : "text-gray-syn2"}`}>
                    {infoLabel}
                </div>
            }
        </>
    );
}
