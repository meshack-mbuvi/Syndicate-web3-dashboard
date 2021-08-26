import Modal, { ModalStyle } from '@/components/modal';
import { validateEmail } from '@/utils/validators';
import React, { useState, useEffect } from 'react';
import SuccessMessage from '../successMessage';


enum FormState {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    SUBMITTING = "SUBMITTING",
    UNSUBMITTED = "UNSUBMITTED"
}

export const MessageCreatorsModal = (props: {
    show: boolean,
    closeModal: () => void,
    syndicateName: string,
    loading?: boolean
}) => {
    const {
        show,
        closeModal,
        syndicateName,
        loading = false
    } = props;

    const [formState, setFormState] = useState(FormState.UNSUBMITTED)
    const [error, setError] = useState(null)
    var email = ""
    var message = ""

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const emailIsValid = validateEmail(email)
        if (emailIsValid) {
            setFormState(FormState.SUBMITTING);
            submitFormToNetlify(event.target)
                .then(() => setFormState(FormState.SUCCESS))
                .catch((err) => {
                setFormState(FormState.FAIL)
                console.log(err); // TODO: send this to 3rd party error tracking.
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
            title={formState === FormState.SUCCESS ? "" : "Message Creators"}
            show={show}
            closeModal={() => {
                closeModal();
                setError(null);
                setFormState(FormState.UNSUBMITTED);
            }}
            loading={loading}
            showCloseButton={true}
            type="normal"
            modalStyle={ModalStyle.DARK}
        >
            <React.Fragment>
                {formState === FormState.UNSUBMITTED &&
                    <form 
                        onSubmit={handleSubmit} 
                        name="message-leads" 
                        method="POST" 
                        data-netlify="true"
                    >
                        <input type="hidden" name="form-name" value="message-leads"/>
                        <input type="hidden" name="syndicate" value={syndicateName}/>
                        <div className="text-sm mb-2 font-medium">
                            What's your email?
                        </div>
                        <input
                            className={`${borderStyle} text-white bg-black font-normal rounded-md w-full p-2 px-3 mb-6 text-sm`}
                            type="email" 
                            name="email" 
                            placeholder="email@example.com"
                            onChange={e => {
                                email = e.target.value;
                                setError(null);
                            }} 
                        />
                        {error &&
                            <p className="text-red-500 text-xs -mt-4 mb-6">
                            {error}
                            </p>
                        }
                        <div className="text-sm mb-2 font-medium">
                            Message
                        </div>
                        <textarea
                            className={`${borderStyle} bg-black h-40 mb-4 rounded-md w-full p-2 px-3 mb-2 text-sm`}
                            name="message"
                            placeholder="Type your message..."
                            onChange={e => {message = e.target.value}}
                        ></textarea>
                        <button className="text-black rounded-md font-normal bg-blue text-white w-full px-6 py-2 mb-3" type="submit">Send</button>
                    </form>}
                {formState === FormState.SUCCESS &&
                    <SuccessMessage
                        title="You've messaged the leads"
                        customClasses="text-center mt-4 mb-5"
                    />
                }
            </React.Fragment>
        </Modal>
    );
};
