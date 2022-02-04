import useUSDCDetails from "@/hooks/useUSDCDetails";
import { InputField } from "../inputField";


export enum TokenType {
    USDC = "USDC",
}

export const InputFieldWithToken = (props: {
    value?: string,
    placeholderLabel?: string,
    infoLabel?: string,
    isInErrorState?: boolean,
    token?: TokenType,
    extraClasses?: string,
    onChange: () => void
}) => {
    const {
        value, 
        placeholderLabel, 
        infoLabel, 
        isInErrorState = false,
        token = TokenType.USDC,
        extraClasses = "", 
        onChange,
        ...rest
    } = props;

    let tokenSymbol;
    let tokenIcon;

    switch (token) {
        case TokenType.USDC: {
            const { depositTokenSymbol, depositTokenLogo } = useUSDCDetails();
            tokenSymbol = depositTokenSymbol;
            tokenIcon = depositTokenLogo
            break;
        }
    }

    const TokenSymbolandIcon = () => {
        return (
            <div className="flex justify-center items-center">
                <div className="mr-2 flex items-center justify-center">
                    <img src={tokenIcon} width={20} height={20} alt="token icon" />
                </div>
                <div className="uppercase">
                    <span>{tokenSymbol}</span>
                </div>
            </div>
        )
    }

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
                    <TokenSymbolandIcon/>
                </div>
            </div>
            {infoLabel && 
                <div className={`text-sm mt-2 ${isInErrorState ? "text-red-error" : "text-gray-syn2"}`}>{infoLabel}</div>
            }
        </>
    );
}
