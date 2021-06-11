import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Spinner } from "src/components/shared/spinner";
import { constants } from "src/components/syndicates/shared/Constants";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";

interface LoaderProp {
  // the contract address the etherscan link should point to
  contractAddress?: string | string[];
  headerText: string;
  subText?: string;
  showRetryButton?: boolean;
  error?: boolean;
  closeLoader?: Function;
  buttonText?: string;
  success?: boolean;
  pending?: boolean;
  retryButtonClasses?: string;
  showlinkToDeposit?: boolean;
}

const { loaderSubtext } = constants;

/** loader component shown to the user when the application is in a
 * submitting state for allowance approvals, deposits, and withdrawals.
 * this component will also be used to show errors from rejected transactions.
 * */

export const SyndicateActionLoader = (props: LoaderProp) => {
  const {
    contractAddress,
    headerText,
    error = false,
    showRetryButton = false,
    closeLoader,
    subText,
    success,
    buttonText,
    pending = false,
    retryButtonClasses = "",
    showlinkToDeposit = false,
  } = props;

  const router = useRouter();

  const { syndicateAddress } = router.query;

  let retryButtonStyles =
    "flex w-full items-center justify-center font-medium rounded-md text-black bg-white focus:outline-none focus:ring py-4 mt-4";
  if (retryButtonClasses) {
    retryButtonStyles = retryButtonClasses;
  }

  return (
    <div className="flex flex-col items-center justify-center my-8 mx-6">
      {error ? (
        <img
          className="mb-4 h-12 w-12"
          src="/images/errorClose.svg"
          alt="error"
        />
      ) : success ? (
        <img
          className="mb-4 h-12 w-12"
          src="/images/checkCircle.svg"
          alt="checkmark"
        />
      ) : (
        <Spinner />
      )}
      <p className="font-semibold text-2xl text-center">{headerText}</p>
      <p className="text-sm my-5 font-normal text-gray-dim text-center">
        {subText ? subText : loaderSubtext}
      </p>
      {error || pending ? null : (
        <EtherscanLink contractAddress={contractAddress} />
      )}
      {showRetryButton ? (
        <button className={retryButtonStyles} onClick={() => closeLoader()}>
          <span className="text-lg">{buttonText}</span>
        </button>
      ) : null}

      {showlinkToDeposit ? (
        <div>
          <Link href={`/syndicates/${syndicateAddress}/deposit`}>
            <a className="font-whyte text-center text-base font-medium text-blue-light hover">
              Go to deposit page.
            </a>
          </Link>
        </div>
      ) : null}
    </div>
  );
};
