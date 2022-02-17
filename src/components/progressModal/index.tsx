import Modal, { ModalStyle } from "../modal";
import { Spinner } from "../shared/spinner";


export enum ProgressModalState {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    CONFIRM = "CONFIRM"
}

export const ProgressModal = (props: {
    isVisible: boolean,
    title: string,
    description?: string,
    state: ProgressModalState,
    buttonLabel?: string,
    buttonOnClick?: () => void,
    etherscanLink?: string
}) => {
    const {
        title,
        description,
        state,
        buttonLabel,
        buttonOnClick,
        etherscanLink,
        isVisible = false,
    } = props;

    let icon;
    switch (state) {
        case ProgressModalState.CONFIRM:
            icon = (<Spinner height="h-16" width="w-16" margin="" />)
            break;
        case ProgressModalState.PENDING:
            icon = (<Spinner height="h-16" width="w-16" margin="" />)
            break;
        case ProgressModalState.SUCCESS:
            icon = (<img height="64" width="64" className="m-auto" src="/images/checkCircleGreen.svg" alt="" />)
            break;
        case ProgressModalState.FAILURE:
            icon = (<img height="64" width="64" className="m-auto" src="/images/syndicateStatusIcons/transactionFailed.svg" alt="" />)
            break;
    }

    return (
        <Modal
            show={isVisible}
            modalStyle={ModalStyle.DARK}
            showCloseButton={false}
            customWidth="w-11/12 md:w-1/2 lg:w-1/3"
            // passing empty string to remove default classes
            customClassName=""
        >
            {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
            <div className="py-10 -mx-4 px-8">
                {/* passing empty margin to remove the default margin set on spinner */}
                {icon}
                <p className="text-xl text-center mt-10  leading-4 text-white font-whyte">
                    {title}
                </p>
                {description &&
                    <div className="font-whyte text-center mt-4 leading-5 text-base text-gray-lightManatee">
                        {description}
                    </div>
                }
                {etherscanLink &&
                    <a href={etherscanLink} className="text-blue-neptune flex items-center space-x-2 justify-center mt-4 focus:outline-none" target="_blank" rel="noreferrer">
                        <div>View on Etherscan</div>
                        <img src="images/externalLinkGray.svg" alt="view on etherscan" />
                    </a>
                }

                {buttonLabel &&
                    <button onClick={buttonOnClick} className="primary-CTA flex-shrink block mx-auto mt-8">{buttonLabel}</button>
                }
            </div>
        </Modal>
    );
}