import { PillButton } from "@/components/pillButtons";
import { InputField } from "../inputField";

export const InputFieldWithButton = (props: {
    value?: string,
    placeholderLabel?: string,
    infoLabel?: string,
    isInErrorState?: boolean,
    extraClasses?: string,
    buttonLabel: string | any,
    isButtonActive?: boolean,
    onChange: () => void
}) => {
    const {
        value, 
        placeholderLabel, 
        infoLabel, 
        isInErrorState = false,
        extraClasses = "", 
        buttonLabel, 
        isButtonActive = false, 
        onChange,
        ...rest
    } = props;

    return (
        <>
            <div className="relative">
                <InputField
                    value={value}
                    placeholderLabel={placeholderLabel}
                    isInErrorState={isInErrorState}
                    extraClasses={extraClasses}
                    onChange={onChange}
                    {...rest}
                />
                <div 
                    className="inline absolute top-1/2 right-4" 
                    style={{transform: "translateY(-50%)"}}
                >
                    <PillButton 
                        isActive={isButtonActive}
                    >
                        {buttonLabel}
                    </PillButton>
                </div>
            </div>
            {infoLabel && 
                <div className={`text-sm mt-2 ${isInErrorState ? "text-red-error" : "text-gray-syn2"}`}>{infoLabel}</div>
            }
        </>
    );
}
