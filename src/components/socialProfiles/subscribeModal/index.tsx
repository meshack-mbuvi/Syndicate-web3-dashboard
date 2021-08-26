import Modal, { ModalStyle } from "@/components/modal";
import { validateEmail } from "@/utils/validators";
import React, { useState } from "react";
import SuccessMessage from "../successMessage";

enum FormState {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    SUBMITTING = "SUBMITTING",
    UNSUBMITTED = "UNSUBMITTED"
}

const SubscribeModal = (props: {
    title: string, 
    isVisible: boolean,
    closeModal: () => void,
    formName: string,
    syndicateToSubscribeTo: string,
    customClasses?: string
}) => {
    const {
        title, 
        isVisible,
        closeModal,
        formName, 
        syndicateToSubscribeTo,
        customClasses
    } = props;

    const [formState, setFormState] = useState(FormState.UNSUBMITTED)
    const [error, setError] = useState(null)
    var email = ""
    var stayUpdatedAboutPlatform = true

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const emailIsValid = validateEmail(email)
        if (emailIsValid) {
            setFormState(FormState.SUBMITTING);
            submitFormToNetlify(event.target)
                .then(() => setFormState(FormState.SUCCESS))
                .catch((err) => {
                setFormState(FormState.FAIL)
                console.log(err);
                });
        }
        else {
            setError("Email is invalid")
        }
    };

    const submitFormToNetlify = async (form: HTMLFormElement) => {
        const formData = new FormData(form);
        return await fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData as any).toString()
        })
    }

    const borderStyle = "border-gray-24 border"

    return (
        <Modal
            title={formState === FormState.SUCCESS ? "" : title}
            show={isVisible}
            closeModal={() => {
                closeModal();
                setError(null);
                setFormState(FormState.UNSUBMITTED);
            }}
            showCloseButton={true}
            type="normal"
            modalStyle={ModalStyle.DARK}
        >
            <React.Fragment>
                {formState === FormState.UNSUBMITTED
                ?   <form
                        name="follow-updates"
                        action="/success"
                        method="POST"
                        data-netlify="true"
                        onSubmit={handleSubmit}
                    >
                        <input type="hidden" name="form-name" value="follow-updates" />
                        <input type="hidden" name="syndicate" value={syndicateToSubscribeTo}/>
                        <p className="text-white mb-4 text-md text-sm font-whyte">Syndicate is currently in private beta. Sign up for updates. Unsubscribe anytime.</p>
                        <input
                            className={`${borderStyle} bg-black text-white font-normal rounded-md w-full p-2 px-3 mb-3 text-sm`}
                            type="email" 
                            name="email" 
                            placeholder="email@example.com"
                            onChange={e => {
                                email = e.target.value;
                                setError(null);
                            }}
                        />
                        {error &&
                            <p className="text-red-500 text-xs -mt-1 mb-3">
                            {error}
                            </p>
                        }
                        <input 
                            type="checkbox" 
                            className="mb-3 mt-2 mr-2" 
                            id="updates" 
                            name="check-stay-updated"
                            defaultChecked
                            onChange={e => {stayUpdatedAboutPlatform = e.target.checked}}
                        />
                        <label htmlFor="updates" className="text-sm font-whyte"> Keep me updated about the platform</label>
                        <button className="rounded-md font-medium bg-blue text-white w-full px-6 py-2 mt-3 mb-3" type="submit">Get Updates</button>
                    </form>
                : null}
                {formState === FormState.SUCCESS
                    ?   <SuccessMessage
                            title="You're subscribed to updates"
                            subtitle="Keep an eye on your inbox for exciting news."
                            customClasses="text-center mt-4 mb-5"
                        />
                    :   null}
             </React.Fragment>
        </Modal>
    );
  };
  
  export default SubscribeModal;
  