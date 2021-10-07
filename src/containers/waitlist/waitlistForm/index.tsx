import InputField from "@/containers/waitlist/shared/inputField";
import SelectField from "@/containers/waitlist/shared/selectField";
import { gql, useMutation } from "@apollo/client";
import withApollo from "lib/withApollo";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

const SUBMIT_WAITLIST_ENTRY = gql`
  mutation SubmitWaitlistEntry(
    $userType: String!
    $usageIntent: String!
    $twitterUsernames: [String]
  ) {
    Social_Waitlist_register(userType: $userType, usageIntent: $usageIntent) {
      updatedAt
    }
    Social_Waitlist_refer(twitterUsernames: $twitterUsernames) {
      fromProfileId
      toProfileId
    }
  }
`;

interface IWaitlistForm {
  setSuccess: Dispatch<SetStateAction<boolean>>;
}

const WaitlistForm = (props: IWaitlistForm) => {
  const [iMa, setIMa] = useState<string>("");
  const [otherValue, setOtherValue] = useState<string>("");
  const [useSyndicateFor, setUseSyndicateFor] = useState<string>("");
  const [twitterUsernames, setTwitterUsernames] = useState<string[]>([""]);
  const [registerWaitList, { loading, error }] = useMutation(
    SUBMIT_WAITLIST_ENTRY,
  );
  const [textLengthError, setTextLengthError] = useState("");
  const [textLengthWarning, setTextLengthWarning] = useState("");
  const [duplicateUserName, setDuplicateUserName] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const maxLength = 480;

  const options = [
    "Founder",
    "Angel Investor",
    "Fund Manager",
    "DAO Contributor",
    "Community Leader",
    "Developer",
    "Other",
  ];
  const { setSuccess } = props;

  const setSelectedOption = (option: string) => {
    setIMa(option);
  };

  const handleTwitterRefs = (username: string, index: number) => {
    const currentUsernames = [...twitterUsernames];
    currentUsernames[index] = username.trim().replace("@", "");
    // check if we have an error before setting active index
    if (!duplicateUserName) {
      setActiveIndex(index);
    }
    setTwitterUsernames(currentUsernames);
  };

  useEffect(() => {
    setHasErrors(duplicateUserName || textLengthError.length > 0);
  }, [duplicateUserName, textLengthError]);

  useEffect(() => {
    // check if user has removed any duplicates and set error to false
    const realUserNames = twitterUsernames.filter((userName) => userName);
    setDuplicateUserName(new Set(realUserNames).size !== realUserNames.length);
  }, [twitterUsernames]);

  // show text area when 'Other' is selected
  const showOtherInput = iMa === options[options.length - 1];

  const addUsernameField = () => {
    const currentUsernames = [...twitterUsernames];
    currentUsernames.push("");
    setTwitterUsernames(currentUsernames);
  };

  const removeUsernameField = (index: number) => {
    const currentUsernames = [...twitterUsernames];
    currentUsernames.splice(index, 1);
    setTwitterUsernames(currentUsernames);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const whoAmi = iMa ? iMa : otherValue;
    const userNames = twitterUsernames.filter((username) => username);
    await registerWaitList({
      variables: {
        userType: whoAmi,
        usageIntent: useSyndicateFor,
        twitterUsernames: userNames,
      },
    });

    // upon successful registration, show confirmation content.
    if (!error) {
      setSuccess(true);
    } else {
      setSuccess(false);
      console.error("ran into an error while submitting waitlist.");
      throw error;
    }
  };

  const handleIntentInput = async (e) => {
    const textLength = e.target.value.length;
    if (textLength > maxLength) {
      setTextLengthError(`${textLength - maxLength} characters over`);
      setTextLengthWarning("");
    } else {
      const remainingCharactersWarning =
        maxLength - textLength <= 80
          ? `${maxLength - textLength} characters remaining`
          : "";
      setTextLengthWarning(remainingCharactersWarning);
      setTextLengthError("");
    }
    setUseSyndicateFor(e.target.value);
  };

  return (
    <form onSubmit={(e) => handleRegister(e)} className="w-full">
      <div id="ima-inputs">
        <SelectField
          placeholder="I'm a..."
          selectOptions={options}
          storeSelectedOption={setSelectedOption}
          selectedValue={iMa}
          showAdditionalInput={showOtherInput}
        />
        {showOtherInput && (
          <InputField
            placeholder="I'm a..."
            asAdditionalInput={showOtherInput}
            handleChange={(e) => setOtherValue(e.target.value)}
          />
        )}
      </div>

      <div>
        <textarea
          id="syndicateFor"
          className="bg-gray-darkInput border-gray-darkInput rounded-custom text-white w-full p-4 mt-4"
          rows={4}
          placeholder="I’d like to use Syndicate for..."
          style={{
            resize: "none",
          }}
          disabled={loading}
          onChange={(e) => handleIntentInput(e)}
        />
        {textLengthError && (
          <p className="text-red-500 text-xs h-1 mt-0 mb-0 text-right">
            {textLengthError}
          </p>
        )}
        {textLengthWarning && (
          <p className="text-yellow-500 text-xs h-1 mt-0 mb-0 text-right">
            {textLengthWarning}
          </p>
        )}
      </div>

      <div id="twitter-refs" className="mt-8">
        <p className="2xl:text-xl mb-2">
          Know someone interested in Syndicate?
        </p>
        {twitterUsernames.length &&
          twitterUsernames.map((username, index) => {
            return (
              <div className="mb-2" key={index}>
                <InputField
                  placeholder="@username"
                  icon="/images/social/smallTwitterGray.svg"
                  handleChange={(e) => handleTwitterRefs(e.target.value, index)}
                  index={index}
                  removeInputField={removeUsernameField}
                  value={username}
                  error={duplicateUserName}
                  prefix="@"
                  placeHolderPadding="twitter-input-field"
                  autoComplete="off"
                  activeIndex={activeIndex}
                />
              </div>
            );
          })}
        {twitterUsernames.length < 3 && !duplicateUserName && <div className="flex justify-center w-full">
          <a
            onClick={addUsernameField}
            className="flex items-center justify-center font-whyte-light cursor-pointer w-fit-content"
          >
            <img
              alt="plus"
              className="mr-2"
              src="/images/social/plus-sign.svg"
            />
            <span className="text-gray-lightManatee">Add username</span>
          </a>
        </div>}
      </div>

      <button
        disabled={loading || hasErrors}
        className={`w-full mx-auto mt-8 ${loading ? "primary-CTA-disabled flex items-center justify-center text-gray-syn4" : "primary-CTA"}`}
      >
        <img
          alt="loading"
          className={`${loading ? "block" : "hidden"} mr-3 animate-spin`}
          src="/images/loading-small-disabled.svg"
        />
        <span>{loading ? "Securing your spot..." : "Get early access"}</span>
      </button>
    </form>
  );
};

export default withApollo(WaitlistForm);
