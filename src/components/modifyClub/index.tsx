import { Switch, SwitchType } from '@/components/switch'
import { floatedNumberWithCommas, numberInputRemoveCommas, numberStringInputRemoveCommas } from '@/utils/formattedNumbers';
import { useEffect, useState } from 'react';
import { Callout } from '../callout';
import { InputFieldWithButton } from '../inputs/inputFieldWithButton';
import { InputFieldWithDate } from '../inputs/inputFieldWithDate';
import { InputFieldWithToken, TokenType } from '../inputs/inputFieldWithToken';
import { PillButtonLarge } from '../pillButtonsLarge';


export const ModifyClubSettings = (props: {
    isVisible: boolean,
    handleClose: () => void
}) => {
    const {
        isVisible,
        handleClose,
    } = props;

    // Existing settings
    // These should be replaced with the real values. They are placeholder for now
    const existingIsOpenToDeposits = true
    const existingOpenToDepositsUntil = new Date(2022, 12, 30, 23, 59, 0, 0);
    const existingAmountRaised = 50000
    const existingMaxAmountRaising = 60000
    const existingMaxNumberOfMembers = 20
    const existingNumberOfMembers = 10

    // Proposed settings
    const [isOpenToDeposits, setIsOpenToDeposits] = useState(existingIsOpenToDeposits)
    const [openToDepositsUntil, setOpenToDepositsUntil] = useState(existingOpenToDepositsUntil)
    const [maxAmountRaising, setMaxAmountRaising] = useState(floatedNumberWithCommas(String(existingMaxAmountRaising)))
    const [maxNumberOfMembers, setMaxNumberOfMembers] = useState(existingMaxNumberOfMembers)

    // Errors
    const [maxAmountRaisingError, setMaxAmountRaisingError] = useState(null)
    const [maxNumberOfMembersError, setMaxNumberOfMembersError] = useState(null)
    
    // Settings change
    const [areClubChangesAvailable, setAreClubChangesAvailable] = useState(false)
    const areClubChangesPending = false

    const MAX_MEMBERS_ALLOWED = 99


    useEffect(() => {
        // Make sure there's a settings change and that there are no errors
        if ((   // Check if settings changed           
                existingIsOpenToDeposits !== isOpenToDeposits ||
                existingOpenToDepositsUntil.getTime() !== openToDepositsUntil.getTime() ||
                existingMaxAmountRaising !== Number(numberStringInputRemoveCommas(String(maxAmountRaising))) ||
                existingMaxNumberOfMembers !== Number(maxNumberOfMembers)
            ) && (
                // Check if there are no errors
                maxAmountRaisingError === null && maxNumberOfMembersError === null
            ) 
        ) {
            setAreClubChangesAvailable(true)
        }
        else {
            setAreClubChangesAvailable(false)
        }

    }, [isOpenToDeposits, openToDepositsUntil, maxAmountRaising, maxNumberOfMembers]);

    return (
        <div className={`${isVisible ? "block" : "hidden"}`}>
            {/* Titles and close button */}
            <div className={`flex justify-between items-center mb-10 space-x-3`}>
                <div className='space-y-2 sm:w-7/12'>
                    <div className='flex items-center space-x-6'>
                        <div className='text-xl'>Modify settings</div>
                        <div className={`text-sm text-gray-syn4 flex items-center space-x-2 ${areClubChangesPending ? "block" : "hidden"} transition-opacity`}>
                            <img src="images/spinner-blue.svg" className='animate-spin' alt="pending" />
                            <div>Modification pending</div>
                            <img src="images/externalLinkGray.svg" alt="view on etherscan" />
                        </div>
                    </div>
                    <div className='text-sm text-gray-syn4'>Submit multiple changes in one on-chain transaction to save on gas fees</div>
                </div>
                <PillButtonLarge
                    onClick={handleClose}
                    extraClasses='flex-shrink-0'
                >
                    <div>{areClubChangesAvailable ? "Discard changes" : "Exit"}</div>
                    <img src="/images/xmark-gray.svg" className='w-4' alt="cancel" />
                </PillButtonLarge>
            </div>

            {/* Modal */}
            <div className={`bg-gray-syn8 p-6 pb-7 transition-all`} style={{borderRadius: "10px"}}>

                {/* Open to deposits */}
                <div className="flex justify-between items-center">
                    <div>Open to deposits</div>
                    <Switch
                        isOn={isOpenToDeposits}
                        type={SwitchType.EXPLICIT}
                        onClick={() => {setIsOpenToDeposits(!isOpenToDeposits)}}
                    />
                </div>
    
                <div className={`${isOpenToDeposits ? "max-h-2screen" : "max-h-0"} overflow-hidden transition-all duration-700`}>
                    <div className={`${isOpenToDeposits ? "opacity-100" : "opacity-0"} transition-opacity`}>

                        {/* Open until */}
                        <div className="xl:flex xl:justify-between ml-6 mt-10">
                            <div className='mb-4 xl:mb-0'>Until</div>
                            <div className="xl:w-76 mr-6 xl:mr-0">
                                <InputFieldWithDate
                                    selectedDate={openToDepositsUntil}
                                    onChange={(targetDate) => {
                                        console.log(`attempted date: ${targetDate}`)
                                        const eodToday = new Date(new Date().setHours(23, 59, 0, 0)).getTime()
                                        const dateToSet = (targetDate as any) < eodToday ? eodToday : targetDate
                                        setOpenToDepositsUntil(new Date(dateToSet))
                                    }}
                                />
                                {/* <LinkButton
                                    type={LinkType.CALENDAR}
                                    extraClasses='mt-5'
                                    onClick={null}
                                /> */}
                            </div>
                        </div>

                        {/* Max amount raising */}
                        <div className="xl:flex xl:justify-between ml-6 mt-10">
                            <div className='mb-4 xl:mb-0'>Max amount raising</div>
                            <div className="xl:w-76 mr-6 xl:mr-0">
                                <InputFieldWithToken
                                    token={TokenType.USDC}
                                    value={maxAmountRaising}
                                    onChange={(e) => {
                                        const amount = Number(numberInputRemoveCommas(e))
                                        console.log(`amount: ${amount}`)
                                        if (amount < existingAmountRaised && amount > 0) {
                                            setMaxAmountRaisingError("Below the current amount raised of 50,000 USDC. Please withdraw funds first before setting a lower limit.")
                                        }
                                        else if (amount <= 0 || isNaN(amount) ) {
                                            setMaxAmountRaisingError("Max amount is required")
                                        }
                                        else {
                                            setMaxAmountRaisingError(null)
                                        }
                                        setMaxAmountRaising(`${amount > 0 ? floatedNumberWithCommas(amount) : ""}`)
                                    }}
                                    isInErrorState={maxAmountRaisingError}
                                    infoLabel={maxAmountRaisingError ? maxAmountRaisingError : "Upper limit of the club’s raise, corresponding to a club token supply of 1,000,000 ✺ABC."}
                                />
                            </div>
                        </div>

                        {/* Max number of members */}
                        <div className="xl:flex xl:justify-between ml-6 mt-10">
                            <div className='mb-4 xl:mb-0'>Max number of members</div>
                            <div className="xl:w-76 mr-6 xl:mr-0">
                                <InputFieldWithButton
                                    value={String(maxNumberOfMembers)}
                                    buttonLabel="Max"
                                    buttonOnClick={() => {
                                        setMaxNumberOfMembers(99)
                                        setMaxNumberOfMembersError(null)
                                    }}
                                    onChange={(e) => {
                                        const numberOfMembers = e.target.value
                                        if (Number(numberOfMembers) < 0) {
                                            setMaxNumberOfMembersError(`Number can't be negative`)
                                        }
                                        else if (isNaN(numberOfMembers)) {
                                            setMaxNumberOfMembersError(`Please enter a number between 1 and 99`)
                                        }
                                        else if (Number(numberOfMembers) < existingNumberOfMembers) {
                                            setMaxNumberOfMembersError(`Club already has ${existingNumberOfMembers} members`)
                                        }
                                        else if (Number(numberOfMembers) > MAX_MEMBERS_ALLOWED) {
                                            setMaxNumberOfMembersError(<div>Between 1 and 99 accepted to maintain investment club status. Reach out to us at <a href="mailto:hello@syndicate.io" className='text-blue-neptune'>hello@syndicate.io</a> if you’re looking to involve more members.</div>)
                                        }
                                        else {
                                            setMaxNumberOfMembersError(null)
                                        }
                                        setMaxNumberOfMembers(Number(`${numberOfMembers > 0 && !isNaN(numberOfMembers) ? numberOfMembers : ""}`))
                                    }}
                                    isInErrorState={maxNumberOfMembersError}
                                    infoLabel={maxNumberOfMembersError ? maxNumberOfMembersError 
                                        : (
                                            <div>Investment clubs may have up to 99 members <a href='https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html' className="underline">according to the SEC</a>. Syndicate encourages all users to consult with their own legal and tax counsel.</div>
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Since we have the fixed disclaimer fixed at the bottom on mobile, we need some space to allow scrolling */}
            <div className={`${areClubChangesAvailable ? "h-80 sm:h-0" : "h-0"} transition-all`}></div>

            {/* Submit changes */}
            <div className={`${areClubChangesAvailable ? "fixed bottom-0 left-0 space-y-6 p-6 pb-8 bg-black bg-opacity-100 sm:bg-opacity-0 sm:p-0 sm:pb-0 sm:mt-10 sm:static" : "bg-opacity-0 p-0 pb-0 mt-10 static"}`}>

                {/* Disclaimer */}
                <div className={`${areClubChangesAvailable ? "max-h-2screen" : "max-h-0"} transition-all duration-700`}>
                    <div className={`${areClubChangesAvailable ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>
                        <div className='text-xs text-gray-syn4'>
                            By submitting these changes, I represent that my access and use of Syndicate’s app and its protocol will fully comply with all applicable laws and regulations, including United States securities laws, and that I will not access or use the protocol to conduct, promote, or otherwise facilitate any illegal activity.
                        </div>
                    </div>
                </div>
                    
                <div className="space-y-6 lg:flex lg:space-x-6 lg:space-y-0">

                    {/* Gas fees */}
                    <div className="flex-grow">
                        <div className={`${areClubChangesAvailable ? "max-h-2screen" : "max-h-0"} transition-all duration-700`}>
                            <div className={`${areClubChangesAvailable ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>
                                <Callout>
                                    <div className='flex justify-between'>
                                        <div className='flex space-x-3'>
                                            <img src="/images/fuel-pump-blue.svg" className='w-4' alt="cancel" />
                                            <div>Estimated gas</div>
                                        </div>
                                        <div>0.05 ETH (~$121.77)</div>
                                    </div>
                                </Callout>
                            </div>
                        </div>
                    </div>
                    
                    {/* Submit button */}
                    <button className={`${areClubChangesAvailable ? "primary-CTA" : "primary-CTA-disabled"} transition-all duration-700 w-full lg:w-auto`}>
                        Submit changes
                    </button>
                </div>
            </div>
        </div>
    );
}