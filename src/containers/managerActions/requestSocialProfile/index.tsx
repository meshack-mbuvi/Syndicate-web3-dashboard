import { TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { requestSocialProfileConstats } from "src/components/syndicates/shared/Constants";
import { validateEmail } from "src/utils/validators";

interface Props {
  showRequestSocialProfile: boolean;
  setShowRequestSocialProfile: Function;
}

const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

/**
 * This component displays a form with textarea to set approved addresses
 * @param props
 * @returns
 */

const RequestSocialProfile = (props: Props) => {
  const { showRequestSocialProfile, setShowRequestSocialProfile } = props;

  const router = useRouter();
  const { syndicateAddress } = router.query;

  // const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [showEmailError, setShowEmailError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleEmailChange = (event) => {
    const { value } = event.target;
    const validEmail = validateEmail(value);

    if (!validEmail) {
      setShowEmailError(true);
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
      setShowEmailError(false);
    }
    setEmail(value);
  };

  const {
    socialProfileDescription,
    socialProfileButtonText,
  } = requestSocialProfileConstats;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!email) {
        setEmailError("Email address is required");
        return;
      }
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "social", email, syndicateAddress }),
      });

      setSuccessMessage("Social profile request received");
      setLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      setSuccessMessage("");
      setErrorMessage(
        "Could not send social profile request, please try again"
      );
      setLoading(false);
      setShowSuccessModal(false);
    }
  };

  return (
    <>
      <Modal
        {...{
          title: "Request Social Profile",
          show: showRequestSocialProfile,
          closeModal: () => setShowRequestSocialProfile(false),
          customWidth: "sm:w-2/3",
        }}
      >
        <div className="mt-5 sm:mt-6 flex justify-center">
          <div>
            <div className="text-gray-400 py-6">{socialProfileDescription}</div>
            {loading ? (
              <div className="space-y-4 text-center loader">Loading</div>
            ) : errorMessage ? (
              <div className="space-y-4">
                <div className="flex flex-row justify-center">
                  <p className="text-red-500">{errorMessage}</p>
                </div>
              </div>
            ) : (
              <form
                name="social"
                method="post"
                data-netlify="true"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="social" />
                <div className="border-2 rounded-lg	bg-gray-99 mt-2 flex px-10 py-6">
                  <div className="w-full flex items-center justify-center">
                    <div className="w-3/4">
                      <input
                        type="hidden"
                        name="syndicateAddress"
                        value={syndicateAddress}
                      />
                      <TextInput
                        {...{
                          label: "Email Address:",
                        }}
                        id="email"
                        name="email"
                        onChange={handleEmailChange}
                        value={email}
                        error={emailError}
                        full
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center	justify-center pt-6">
                  <button
                    className="bg-blue-light text-white	py-2 px-10 rounded-full"
                    disabled={loading || showEmailError}
                    type="submit"
                  >
                    {socialProfileButtonText}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Modal>
      {/* success modal */}
      <Modal
        {...{
          show: showSuccessModal,
          closeModal: () => setShowSuccessModal(false),
          type: "success",
          customWidth: "w-5/12",
        }}
      >
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center my-2 mb-6">
            <img src="/images/checkCircle.svg" className="w-16" />
          </div>
          <div className="modal-header mb-4 text-black font-medium text-center ">
            <p className="text-2xl font-whyte ">{successMessage}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RequestSocialProfile;
