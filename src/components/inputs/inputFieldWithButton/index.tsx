import { PillButton } from "@/components/pillButtons";
import { InputField } from "../inputField";

export const InputFieldWithButton = (props: {
    value?: string,
    placeholderLabel?: string,
    infoLabel?: string | any,
    isInErrorState?: boolean,
    extraClasses?: string,
    buttonLabel: string | any,
    isButtonActive?: boolean,
    buttonOnClick?: () => void,
    onChange: (e) => void
}) => {
    const {
        value, 
        placeholderLabel, 
        infoLabel, 
        isInErrorState = false,
        extraClasses = "", 
        buttonLabel, 
        isButtonActive = false, 
        buttonOnClick,
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
                        onClick={buttonOnClick}
                    >
                        {buttonLabel}
                    </PillButton>
                </div>
            </div>
            {infoLabel && 
                <div className={`text-sm mt-2 ${isInErrorState ? "text-red-error" : "text-gray-syn4"}`}>{infoLabel}</div>
            }
        </>
    );
}
