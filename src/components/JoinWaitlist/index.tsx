import { useState } from "react";
import { validateEmail } from "@/utils/validators";
import { joinWaitlist, openToInvestors, syndicateBeta, welcomeToSydicate } from "../syndicates/shared/Constants";


const defaultState = {
  label: joinWaitlist,
  style: "text-black",
  statusIcon: null,
  btnDisabled: false,
}

const subscribedState = {
  label: "Subscribed",
  style: "text-white bg-gray-800 cursor-not-allowed",
  statusIcon: (
    <span>
      <svg className="h-4 w-4 mr-2" width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 8.79032L7.14955 15L21 1" stroke="white" strokeWidth="2" />
      </svg>
    </span>
  ),
  btnDisabled: true,
}

const subscribingState = {
  ...subscribedState,
  label: "Subscribing",
  statusIcon: (
    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M 4 12 a 8 8 0 0 1 8 -8 V 0 C 5 0 0 5 0 12 h 4 z A 1 1 0 0 1 4 12 H 0 c 0 7 5 12 12 12 l 0 -4 C 8 20 4 16 4 12"></path>
    </svg>
  ),
}

const JoinWaitlist = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscriptionState, setSubscriptionState] = useState(defaultState);

  const handleChange = (event: any) => {
    setEmail(event.target.value);
    if (error) setError("");
    if (subscriptionState.label === subscribedState.label) setSubscriptionState(defaultState);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const validEmail = validateEmail(email);
    if (!email.trim()) {
      setError("Email name is required");
    } else if (!validEmail) {
      setError("Email is invalid");
    } else {
      setSubscriptionState(subscribingState);
      submitFormToNetlify(event.target)
        .then(() => setSubscriptionState(subscribedState))
        .catch((err) => {
          setError("Oops!!! Something went wrong.");
          console.log(err); // TODO: send this to 3rd party error tracking.
        });
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

  return (
    <div className="font-whyte">
      <p className="font-semibold text-2.5xl pb-1">{welcomeToSydicate}</p>
      <p className="py-5 text-sm">{syndicateBeta}</p>

      <form onSubmit={handleSubmit} name="JoinWaitlist" method="POST" data-netlify="true">

        <input
          name="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={handleChange}
          className={`flex w-full min-w-0 py-4 font-whyte text-lg rounded-md bg-gray-9 border border-gray-24 text-white focus:outline-none focus:ring-gray-24 focus:border-gray-24 flex-grow ${!error && "mb-5"}`}
        />
        <p className="text-red-500 text-xs mt-1 mb-1">
          {error}
        </p>

        <button
          className={`flex w-full items-center justify-center font-medium rounded-md bg-white focus:outline-none focus:ring py-4 mb-4 mt-3 ${subscriptionState.style}`}
          type="submit"
          disabled={subscriptionState.btnDisabled}
        >
          {subscriptionState.statusIcon}
          <span className="text-lg">{subscriptionState.label}</span>
        </button>

      </form>

      <p className="flex justify-center text-gray-500 text-sm">{openToInvestors}</p>
    </div>
  )
}

export default JoinWaitlist;
