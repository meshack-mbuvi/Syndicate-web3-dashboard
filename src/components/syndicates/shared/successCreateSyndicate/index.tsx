import Link from "next/link";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { EtherscanLink } from "../EtherscanLink";

const SuccessCreateSyndicate: React.FC<{ account: string }> = ({ account }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syndicateDepositLink, setSyndicateDepositLink] = useState("");

  useEffect(() => {
    setSyndicateDepositLink(
      `${window.location.origin}/clubs/${account}/`,
    );
  }, [account]);

  useEffect(() => {
    // Show confetti when the success page is displayed
    setShowConfetti(true);
  }, []);

  /**
   * Show copied text for 2 seconds when user clicks the copy icon
   */
  const handleOnCopy = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center w-full z-10">
      <Confetti
        style={{ pointerEvents: "none", position: "fixed" }}
        numberOfPieces={showConfetti ? 1000 : 0}
        recycle={false}
        onConfettiComplete={(confetti) => {
          setShowConfetti(false);
          confetti.reset();
        }}
      />
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <div className="w-full flex justify-center mb-6">
          <img
            src="/images/checkCircleGreen.svg"
            className="h-12 w-12"
            alt="error"
          />
        </div>
        <p className="font-semibold text-1.5xl text-center mb-8">
          Done! You just created a syndicate.
        </p>

        <div className="flex flex-col items-center  w-full">
          <p className="text-sm text-blue-rockBlue mb-2.5">
            Your syndicate’s permanent address is
          </p>
          <div className="flex w-full items-center justify-center mb-2.5">
            <input
              className="text-center rounded-full bg-black font-whyte appearance-none border-1 border-gray-600 w-5/6 py-2 px-2 text-white leading-tight focus:outline-none"
              disabled
              defaultValue={account}
            />
            <div className="flex align-center justify-center ml-2">
              {copied ? (
                <span className="text-sm text-white font-whyte-light opacity-80">
                  copied
                </span>
              ) : (
                <>
                  <CopyToClipboard
                    text={syndicateDepositLink}
                    onCopy={handleOnCopy}
                  >
                    <p className="flex font-whyte text-sm cursor-pointer hover:opacity-80 text-white">
                      <img
                        src="/images/copy.svg"
                        className="w-4 mr-1 font-whyte-light cursor-pointer border-blue text-blue"
                        alt="copy-icon"
                      />
                    </p>
                  </CopyToClipboard>
                </>
              )}
            </div>
          </div>

          <EtherscanLink etherscanInfo={account} />
        </div>
        <Link href={`/clubs/${account}/manage`}>
          <span className="my-8 py-4 text-lg text-center cursor-pointer bg-blue hover:bg-blue-600 border border-transparent rounded w-4/5">
            Go to your syndicate’s profile
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SuccessCreateSyndicate;
