import { SocialAction, SocialActionButton } from "@/components/buttons";
import { useState } from "react";
import { MessageCreatorsModal } from "../messageCreatorsModal";
import SubscribeModal from "../subscribeModal";

const SocialActionButtons = (props: {
    customActionButtons?: {title: string, action: SocialAction, URL: string}[],
    syndicateName: string
}) => {
    const {customActionButtons, syndicateName} = props;

    const [isSubscribeCardVisible, setSubscribeCardVisibility] = useState(false)
    const [isMessageFormVisible, setMessageFormVisiblility] = useState(false)

    const renderedCustomActionButtons = customActionButtons 
        ? customActionButtons.map((customActionButton) => {  
                return (
                    <SocialActionButton 
                        action={customActionButton.action} 
                        url={customActionButton.URL} />     
                );
            })
        : null

    return (
        <div className="md:pl-96 md:-ml-96 md:pr-40 md:-mr-40 overflow-x-scroll overflow-y-hidden relative flex no-scroll-bar mt-8 md:mx-auto md:whitespace-normal md:w-auto edge-to-edge-with-left-inset">
            
            {/* Modals */}
            <MessageCreatorsModal
                show={isMessageFormVisible}
                closeModal={() => {setMessageFormVisiblility(false)}}
                syndicateName={syndicateName}
            />
            <SubscribeModal
                title="Follow Updates About this Syndicate"
                isVisible={isSubscribeCardVisible}
                closeModal={() => {setSubscribeCardVisibility(false)}}
                formName="follow-updates"
                syndicateToSubscribeTo={syndicateName}
                customClasses="text-left absolute"
            />

            {/* Buttons */}
            <SocialActionButton action={SocialAction.FOLLOW} onClick={() => {setSubscribeCardVisibility(true)}}/>
            <SocialActionButton action={SocialAction.MESSAGE} onClick={() => {setMessageFormVisiblility(true)}}/>
            {renderedCustomActionButtons} 
        </div> 
    );
};
  
export default SocialActionButtons;
