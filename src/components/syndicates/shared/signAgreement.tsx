import { amplitudeLogger, Flow } from "@/components/amplitude";
import { MGR_SIGN_LEGAL_DOC } from "@/components/amplitude/eventNames";
import { DiscordLink } from "@/components/DiscordLink";
import { EmailSupport } from "@/components/emailSupport";
import { AppState } from "@/state";
import { setWalletSignature } from "@/state/legalInfo";
import { IClubInfo, IMemberInfo } from "@/state/legalInfo/types";
import { formatAddress } from "@/utils/formatAddress";
import { getTemplates } from "@/utils/templates";
import Modal, { ModalStyle } from "@/components/modal";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";

import mapValues from "lodash/mapValues";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useIsVisible } from "react-is-visible";
import { useDispatch, useSelector } from "react-redux";

const agreementSteps = [
  {
    noun: "Operating agreement",
    verb: `
      An agreement between the LLC and a member that outlines the
      LLC's financial, governance and functional decisions
      including rules, regulations, and provisions.`,
  },
  {
    noun: "Subscription agreement",
    verb: `
      An agreement between the LLC and a member to receive an
      interest in the LLC (or 'subscribe') for an
      agreed-upon amount. The agreement also includes several
      statements that the subscribing member needs to confirm for
      tax and regulatory reasons.`,
  },
];

const nonHighlightFields = new Set([
  "percentLoss",
  "blockNumber",
  "daysNotice",
  "adminRemovalThreshold",
  "taxPercentage",
  "isSeriesLLC",
  "hasCounsel",
]);
const memberFields = new Set(["memberName", "emailAddress", "depositAmount"]);
const optionalFields = new Set([
  "masterLLC",
  "isSeriesLLC",
  "counselName",
  "counselEmail",
  "adminSignDate",
  "seriesLLC",
  "hasCounsel",
]);

interface ISignAgreementProps {
  handleSignatureSuccess?: () => void;
  isManager: boolean;
  fieldInfo: IMemberInfo | IClubInfo;
}

const SignAgreement: React.FC<ISignAgreementProps> = ({
  handleSignatureSuccess,
  fieldInfo,
  isManager,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { clubAddress } = router.query;

  const {
    web3Reducer: {
      web3: { web3, account },
    },
    legalInfoReducer: {
      walletSignature: { signature, timeSigned },
    },
  } = useSelector((state: AppState) => state);

  const [currentField, setCurrentField] = useState(1);
  const [documentFields, setDocumentFields] = useState([]);
  const [fieldError, setFieldError] = useState(false);
  const [showManualSignModal, setShowManualSignModal] = useState(false);

  const operatingAgTitleRef = useRef(null);
  const subscriptionAgTitleRef = useRef(null);
  const operatingAgRef = useRef(null);
  const subscriptionAgRef = useRef(null);
  const isOperatingAgVisible = useIsVisible(operatingAgRef);
  const isSubscriptionAgVisible = useIsVisible(subscriptionAgRef);

  const signedBadge = `<span
    class="flex flex-row items-center border border-gray-syn5 rounded-full px-6 py-2 mb-10 w-max text-sm text-gray-syn5 bg-gray-syn6 bg-opacity-5 mx-auto"
    data-item="signature"
    style="white-space: initial;"
    >
    <img
      src="/images/wallet.svg"
      class="w-4 h-3 mr-4"
      alt="wallet-icon"
    />
    <span class="flex flex-col">
      <span>
        Signed
        <span classe="text-black">
          &nbsp;${moment(timeSigned).format("lll")}
        </span>
      </span>
      <span>
        By 0x
        <span class="text-black">
          ${formatAddress(account, 7, 6).slice(2)}
        </span>
      </span>
    </span>
    </span>`;
  const fillers = isManager
    ? {
        adminSignature: signature ? signedBadge : "SIGN HERE",
        adminSignDate: moment().format("LL"),
        clubTokenAddress: clubAddress,
        emailAddress: "",
        depositAmount: "",
        memberName: "",
        memberSignDate: "",
        memberSignature: "",
      }
    : {
        clubTokenAddress: clubAddress,
        memberSignature: signature ? signedBadge : "SIGN HERE",
        memberSignDate: moment().format("LL"),
      };

  useEffect(() => {
    if (signature) {
      const signatureElement = document.querySelector(
        "span[data-item='signature']",
      );

      signatureElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "end",
      });
    }
  }, [signature]);

  const { compiledOp, compiledSub } = getTemplates(fieldInfo["isSeriesLLC"]);

  useEffect(() => {
    const isFieldInfoEmpty = Object.keys(fieldInfo).some(
      (key) => !fieldInfo[key] && !optionalFields.has(key),
    );

    if (router.isReady && isFieldInfoEmpty) {
      const path = router.pathname.includes("manage")
        ? `/clubs/${clubAddress}/manage/legal/prepare`
        : `/clubs/${clubAddress}`;
      router.push(path);
    }
  }, [clubAddress, fieldInfo, router]);

  const fieldValues = useMemo(
    () =>
      mapValues(
        fieldInfo,
        (value: string, key) =>
          nonHighlightFields.has(key) || (!isManager && !memberFields.has(key))
            ? value
            : `<span class="font-semibold" data-field="${key}">${
                key === "generalPurposeStatement" ? value.toLowerCase() : value
              }</span>`, // general purpose should be in lowercase
      ),
    [fieldInfo, isManager],
  );

  useLayoutEffect(() => {
    handleScroll();
  }, [router.isReady, currentField]);

  const handleScroll = () => {
    if (documentFields.length && currentField > documentFields.length)
      return setFieldError(true);
    if (!router.isReady || isNaN(currentField) || currentField < 1) return;
    setFieldError(false);
    const fields = [].slice.call(document.querySelectorAll("span[data-field]"));
    fields.forEach((field: HTMLElement) =>
      field.classList.remove("bg-yellow-highlight"),
    );

    setDocumentFields(fields);

    const currentElement = fields[currentField - 1];
    currentElement.classList.add("bg-yellow-highlight");
    currentElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "end",
    });
  };

  const handleNextField = () =>
    setCurrentField((prev) =>
      currentField === documentFields.length ? currentField : prev + 1,
    );

  const handlePreviousField = () =>
    setCurrentField((prev) => (currentField === 1 ? 1 : prev - 1));

  const isGnosisSafe =
    web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig";

  const handleWalletSignature = async () => {
    const name = isManager
      ? (fieldInfo as IClubInfo).adminName
      : (fieldInfo as IMemberInfo).memberName;

    let signature: string;

    if (isGnosisSafe) {
      signature = account;
      setShowManualSignModal(false);
    } else {
      signature = await web3.eth.personal.sign(
        `Please sign your name: ${name}`,
        account,
        null,
      );
    }

    if (!signature) return;

    dispatch(setWalletSignature({ signature, timeSigned: new Date() }));

    if (isManager) {
      const legal = {
        ...JSON.parse(localStorage.getItem("legal") || "{}"),
        [`${clubAddress}`]: {
          signaturesNeeded: true,
          clubData: { ...fieldInfo, adminSignature: signature },
        },
      };
      localStorage.setItem("legal", JSON.stringify(legal));
    }
    amplitudeLogger(MGR_SIGN_LEGAL_DOC, {
      flow: Flow.LEGAL_ENTITY_FLOW,
    });
  };

  const [inputWidth, setInputWidth] = useState(0);
  const span = useRef(null);

  useEffect(() => {
    setInputWidth(span.current.offsetWidth);
  }, [currentField]);

  return (
    <div className="flex flex-col md:flex-row -mt-4 px-0 sm:px-10 mx-auto w-full md:space-x-28">
      <div className="flex flex-col w-full md:w-1/4 text-right md:sticky md:h-full top-20">
        <div className="md:pt-20">
          <div className="hidden md:flex justify-end pb-8">
            <button onClick={router.back}>
              <div className="text-gray-syn10 flex flex-row items-center space-x-3 cursor-pointer">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
              </div>
            </button>
          </div>
          <div className="hidden md:block">
            <Stepper
              {...{
                isOperatingAgVisible,
                isSubscriptionAgVisible,
                operatingAgTitleRef,
                subscriptionAgTitleRef,
              }}
            />
          </div>
        </div>
        <div className="flex-col hidden md:flex" style={{ paddingTop: "20vh" }}>
          <div className="pb-3">Questions?</div>
          <div className="text-sm text-gray-syn4">
            Contact us at&nbsp;
            <EmailSupport />
            &nbsp;or on&nbsp;
            <DiscordLink />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full md:w-3/4">
        <div className="fixed bottom-0 sm:top-20 sm:sticky sm:h-full bg-black z-8 md:z-0 w-full px-10 sm:px-0">
          <div className="flex flex-row justify-between items-center w-full py-6">
            <div className="text-xl md:text-1.5xl">Review &amp; Confirm</div>
            <div className="flex flex-row items-center">
              <button className="p-3" onClick={handlePreviousField}>
                <ChevronUpIcon className="w-5 h-5 text-gray-syn4" />
              </button>
              <span className="absolute opacity-0" ref={span}>
                {!isNaN(currentField) && currentField}
              </span>
              <input
                type="number"
                className={`border border-gray-24 py-4.5 px-6 rounded-md ml-1 mr-4 focus:outline-none bg-transparent font-whyte ${
                  fieldError
                    ? "text-red-error border-red-error focus:ring-red-error focus:border-red-error"
                    : "text-white focus:border-blue focus:ring-gray-24"
                } text-center`}
                value={currentField}
                onChange={(e) => {
                  const value = parseInt(e.currentTarget.value);
                  if (value < 1) return;
                  setCurrentField(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleScroll();
                  }
                }}
                onBlur={() => {
                  if (isNaN(currentField)) setCurrentField(1);
                }}
                style={{ width: inputWidth + 50 }}
              />
              <span className="mr-1 inline-block">
                of {documentFields.length}{" "}
                <span className="hidden sm:inline-block">fields</span>
              </span>
              <button className="p-3" onClick={handleNextField}>
                <ChevronDownIcon className="w-5 h-5 text-gray-syn4" />
              </button>
            </div>
            <div className="hidden md:block">
              <CTAs
                {...{
                  isManager,
                  signature,
                  handleSignatureSuccess,
                  handleWalletSignature,
                  isGnosisSafe,
                  setShowManualSignModal,
                }}
              />
            </div>
          </div>
          <div className="block md:hidden pb-8 sticky h-full">
            <CTAs
              {...{
                isManager,
                signature,
                handleSignatureSuccess,
                handleWalletSignature,
                isGnosisSafe,
                setShowManualSignModal,
              }}
            />
          </div>
        </div>
        <div className="block md:hidden pb-6 sticky h-full bg-black top-20 pt-3 sm:pt-0 sm:top-71">
          <Stepper
            {...{
              isOperatingAgVisible,
              isSubscriptionAgVisible,
              operatingAgTitleRef,
              subscriptionAgTitleRef,
            }}
          />
        </div>
        <div className="flex flex-col space-y-5">
          <div className="bg-white rounded-none text-black h-full overflow-x-hidden">
            <div className="container mx-auto flex flex-col py-12">
              {/* Text Document Content. Change code below */}
              <span ref={operatingAgRef}>
                <span className="text-center py-5 legal-doc-sign" ref={operatingAgTitleRef}>
                  Operating Agreement
                </span>
                <span
                  className="leading-6 text-base legal-doc-sign"
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{
                    __html: compiledOp({ ...fieldValues, ...fillers }),
                  }}
                />
              </span>
            </div>
          </div>
          <div className="bg-white rounded-none text-black h-full overflow-x-hidden">
            <div className="container mx-auto flex flex-col py-12">
              <span ref={subscriptionAgRef}>
                <span className="text-center py-5 legal-doc-sign" ref={subscriptionAgTitleRef}>
                  Subscription Agreement
                </span>
                <span
                  className="leading-6 text-base legal-doc-sign"
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{
                    __html: compiledSub({ ...fieldValues, ...fillers }),
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <ManualSign
        {...{
          showManualSignModal,
          setShowManualSignModal,
          account,
          handleWalletSignature,
        }}
      />
    </div>
  );
};

export default SignAgreement;

const Stepper = ({
  isOperatingAgVisible,
  isSubscriptionAgVisible,
  operatingAgTitleRef,
  subscriptionAgTitleRef,
}) => {
  const [activeAgreement, setActiveAgreement] = useState(0);

  useEffect(() => {
    if (isSubscriptionAgVisible) {
      setActiveAgreement(1);
    } else {
      setActiveAgreement(0);
    }
  }, [isOperatingAgVisible, isSubscriptionAgVisible]);

  const handleActiveAg = (idx: number) => {
    setActiveAgreement(idx);
    const mapper = { 0: operatingAgTitleRef, 1: subscriptionAgTitleRef };
    mapper[idx].current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="flex flex-col md:flex-row space-y-5 md:space-x-10 px-6-percent sm:px-0">
      <div className="flex flex-row md:flex-col md:space-y-10">
        {agreementSteps.map((step, idx) => (
          <div
            className={`cursor-pointer w-1/2 md:w-full ${
              idx === activeAgreement ? "" : "opacity-50"
            }`}
            key={idx}
            onClick={() => handleActiveAg(idx)}
            aria-hidden="true"
          >
            <div>{step.noun}</div>
            <div className="text-gray-syn4 text-sm hidden md:flex">
              {step.verb}
            </div>
          </div>
        ))}
      </div>
      <div className="relative">
        <div
          className={`bg-green w-1/2 h-1 md:w-1 md:h-1/2 absolute ${
            activeAgreement === 1 ? "left-1/2 top-1/2" : "left-0 top-0"
          }`}
        />
        <div className="bg-green w-full h-1 md:w-1 md:h-full absolute inset-0 opacity-50" />
      </div>
    </div>
  );
};

const CTAs = ({
  isManager,
  signature,
  handleSignatureSuccess,
  handleWalletSignature,
  isGnosisSafe,
  setShowManualSignModal,
}) => {
  return (
    <div>
      {signature ? (
        <button
          className="py-4 px-8 rounded-md bg-green text-black flex flex-row items-center font-whyte-medium space-x-2  w-full justify-center"
          onClick={handleSignatureSuccess}
        >
          <span>{isManager ? "Send for signatures" : "Finish"}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      ) : isGnosisSafe ? (
        <button
          className="py-4 px-8 rounded-md bg-green text-black flex flex-row items-center font-whyte-medium space-x-2  w-full justify-center"
          onClick={() => {
            setShowManualSignModal(true);
          }}
        >
          Sign
          <img
            className="pl-2"
            src="/images/pencil.and.outline.svg"
            alt="sign"
          />
        </button>
      ) : (
        <button
          className="py-4 px-8 rounded-md bg-green text-black flex flex-row items-center font-whyte-medium w-full justify-center"
          onClick={handleWalletSignature}
        >
          Sign
          <img
            className="pl-2"
            src="/images/pencil.and.outline.svg"
            alt="sign"
          />
        </button>
      )}
    </div>
  );
};

const ManualSign = ({
  showManualSignModal,
  setShowManualSignModal,
  account,
  handleWalletSignature,
}) => {
  return (
    <div>
      <Modal
        {...{
          modalStyle: ModalStyle.DARK,
          show: showManualSignModal,
          closeModal: () => {
            setShowManualSignModal(false);
          },
          customWidth: "w-100",
          customClassName: "pt-8 px-5 pb-5",
          showCloseButton: false,
          outsideOnClick: true,
          showHeader: false,
          alignment: "align-top",
          margin: "mt-48",
        }}
      >
        <>
          <div className=" px-5 -mb-1">
            <div className=" text-sm font-medium">
              SIGN WITH CURRENT WALLET ADDRESS
            </div>
            <div className=" text-base text-gray-syn4 mt-8">
              Confirm you are signing on on behalf of this address.
            </div>
            <div className=" mt-1 text-lg w-full break-words px-2 py-4 bg-gray-syn7 rounded-custom bg-opacity-60">
              {account}
            </div>
            <div className="text-sm mt-6 text-gray-syn4">
              I agree to be legally bound by this document and the Syndicate{" "}
              <a
                href="https://docs.google.com/document/d/1U5D6AtmZXrxmgBeobyvHaXTs7p7_wq6V/edit"
                className="text-blue"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Service
              </a>
              .
            </div>
            <div className=" mt-2">
              <button
                className=" bg-white rounded-custom w-full flex flex-row items-center justify-center py-4 mb-4 text-black"
                onClick={handleWalletSignature}
              >
                Confirm and Sign{" "}
                <img
                  className="pl-2"
                  src="/images/pencil.and.outline.svg"
                  alt="sign"
                />
              </button>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};
