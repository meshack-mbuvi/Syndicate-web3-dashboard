import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ExternalLinkIcon } from "src/components/iconWrappers";
import { BadgeCard, DetailsCard } from "../shared";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";

// utils
import { formatAddress } from "src/utils/formatAddress";
import { etherToNumber, formatDate } from "src/utils";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";

const SyndicateDetails = (props) => {
  const {
    web3: { syndicateInstance, account },
    dispatch,
    syndicateDetails,
  } = props;
  const router = useRouter();
  const [details, setDetails] = useState([]);
  const [syndicate, setSyndicate] = useState({
    maxDeposit: 0,
    openToDeposits: false,
    totalDeposits: 0,
    managerManagementFeeBasisPoints: 0,
    depositERC20ContractAddress: "",
    profitShareToSyndicateLead: 0,
    profitShareToSyndicateProtocol: 0,
    closeDate: "",
    active: true,
    createdDate: "",
    distributionsEnabled: false,
  });

  // state to handle copying of the syndicate address to clipboard.
  const [showCopyState, setShowCopyState] = useState<boolean>(false);

  // state to handle details about the current ERC20 token
  const [tokenSymbol, setTokenSymbol] = useState<string>("DAI");

  // get syndicate address from the url
  const { syndicateAddress } = router.query;

  const {
    openToDeposits,
    distributionsEnabled,
    depositERC20ContractAddress,
    active
  } = syndicate;

  useEffect(() => {
    // get and set current token details
    if (depositERC20ContractAddress) {
      getERC20TokenDetails(depositERC20ContractAddress);
    }
  }, [syndicate, syndicateInstance]);

  useEffect(() => {
    if (syndicate) {
      let {
        closeDate,
        createdDate,
        profitShareToSyndicateProtocol,
        profitShareToSyndicateLead,
        managerManagementFeeBasisPoints,
      } = syndicate;

      setDetails([
        { header: "Created on", subText: createdDate },
        { header: "Close Date", subText: closeDate },
        {
          header: "Deposit/Distribution Token",
          subText: `${tokenSymbol} / ${tokenSymbol}`,
        },
        {
          header: "Expected Annual Operating Fees",
          subText: `${managerManagementFeeBasisPoints / 100}%`,
        },
        {
          header: "Profit Share to Syndicate Lead",
          subText: `${profitShareToSyndicateLead / 100}%`,
        },
        {
          header: "Profit Share to Protocol",
          subText: `${profitShareToSyndicateProtocol / 100}%`,
        },
      ]);
    }
  }, [syndicate, syndicateDetails]);

  /**
   * method used to get details on the current ERC20 token
   * @param depositERC20ContractAddress The address of the ERC20 token.
   * updates token symbol and decimals in the state.
   */
  const getERC20TokenDetails = async (
    depositERC20ContractAddress: string | string[]
  ) => {
    const erc20Token = new ERC20TokenDetails(depositERC20ContractAddress);
    const symbol = await erc20Token.getTokenSymbol();

    // getting token symbol doesn't seem to return a valid hex value
    // returns 0x0000000000000000000000000000000000000000000000000000000000000020
    // the above translates to an empty string
    // need to find a proper way to get the correct symbol.
    // putting in this temporary fix for now.
    if (symbol.trim().length < 10) {
      setTokenSymbol(symbol);
    }
  };

  useEffect(() => {
    if (syndicateInstance) {
      // dispatch action to get details about the syndicate
      // These values will be used in other components that might
      // need them.
      const {
        depositERC20ContractAddress,
        profitShareToSyndicateLead,
        profitShareToSyndicateProtocol,
      } = syndicate;

      dispatch(
        setSyndicateDetails(
          syndicateInstance,
          depositERC20ContractAddress,
          profitShareToSyndicateLead,
          profitShareToSyndicateProtocol,
          syndicate
        )
      );
    }
  }, [syndicate, syndicateAddress]);

  useEffect(() => {
    if (syndicateInstance) {
      try {
        syndicateInstance
          .getSyndicateValues(syndicateAddress)
          .then((data) => {
            const closeDate = formatDate(
              new Date(data.closeDate.toNumber() * 1000)
            );
            /**
             * block.timestamp which is the one used to save creationDate is in
             * seconds. We multiply by 1000 to convert to milliseconds and then
             * convert this to javascript date object
             */
            const createdDate = formatDate(
              new Date(data.creationDate.toNumber() * 1000)
            );

            const maxDeposit = data.maxDeposit.toString();
            const minDeposit = data.minDeposit.toString();

            const profitShareToSyndicateProtocol = data.syndicateProfitShareBasisPoints.toNumber();

            const profitShareToSyndicateLead = data.managerPerformanceFeeBasisPoints.toNumber();
            const openToDeposits = data.syndicateOpen;
            const totalDeposits = etherToNumber(data.totalDeposits.toString());
            const managerManagementFeeBasisPoints = data.managerManagementFeeBasisPoints.toNumber();
            const depositERC20ContractAddress =
              data.depositERC20ContractAddress;
            const distributionsEnabled = data.distributionsEnabled;

            // get details about the current ERC20 token
            getERC20TokenDetails(depositERC20ContractAddress);

            const syndicateDetails = {
              maxDeposit,
              openToDeposits,
              totalDeposits,
              managerManagementFeeBasisPoints,
              depositERC20ContractAddress,
              profitShareToSyndicateLead,
              closeDate,
              minDeposit,
              active: true,
              createdDate,
              profitShareToSyndicateProtocol,
              distributionsEnabled,
            };

            setSyndicate(syndicateDetails);
          })
          .catch((err) => console.log({ err }));
      } catch (err) {
        console.log({ err });
      }
    }
  }, [syndicateInstance, account]);

  // format an account address in the format 0x3f6q9z52…54h2kjh51h5zfa
  const formattedSyndicateAddress = formatAddress(syndicateAddress, 10, 14);

  // show message to the user when address has been copied.
  const updateAddresCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  // syndicate badges.
  // display relevant badges based on the current state of the syndicate.
  // set default syndicate state
  let syndicateBadge = (
    <BadgeCard
      {...{
        title: "Status",
        subTitle: "Closed to Deposits",
        text: "Depositing not available",
        icon: (
          <span className="rounded-full bg-yellow-300 mt-2 w-4 h-4 ml-1"></span>
        ),
      }}
    />
  );

  if (openToDeposits && !distributionsEnabled) {
    syndicateBadge = (
      <BadgeCard
        {...{
          title: "Status",
          subTitle: "Open to Deposits",
          text: "Depositing available",
          icon: (
            <span className="rounded-full bg-yellow-300 mt-2 w-4 h-4 ml-1"></span>
          ),
        }}
      />
    );
  } else if (distributionsEnabled && !openToDeposits) {
    syndicateBadge = (
      <BadgeCard
        {...{
          title: "Status",
          subTitle: "Operating",
          text: "Withdrawals available",
          icon: (
            <span className="rounded-full bg-green-300 mt-2 w-4 h-4 ml-1"></span>
          ),
        }}
      />
    );
  } else if (!active) {
    syndicateBadge = (
      <BadgeCard
        {...{
          title: "Status",
          subTitle: "Inactive",
          text: "Deposits and withdrawals not available",
          icon: (
            <span className="rounded-full bg-yellow-300 mt-2 w-4 h-4 ml-1"></span>
          ),
        }}
      />
    );
  }

  return (
    <div className="w-full sm:w-2/3 h-fit-content p-6 md:p-10">
      <span className="fold-bold px-2 text-gray-dim leading-4 text-lg uppercase">
        Syndicate
      </span>
      <div className="flex justify-between items-center">
        <div className="flex-shrink">
          <p className="flex text-sm sm:text-2xl lg:text-3xl flex-wrap pl-2 break-all flex items-center">
            {formattedSyndicateAddress}
            <CopyToClipboard text={syndicateAddress}>
              <div className="flex items-center ml-4 relative w-10">
                {showCopyState ? (
                  <span className="absolute text-xs -top-5">copied</span>
                ) : null}
                <img
                  src="/images/copy-clipboard.png"
                  className="cursor-pointer h-4"
                  onClick={updateAddresCopyState}
                />
              </div>
            </CopyToClipboard>

            <p
              className={`h-6 w-6 sm:h-10 sm:w-10 md:h-16 md:w-16 ml-4 rounded-full ideo-liquidity inline`}
            ></p>
          </p>
        </div>
      </div>
      <a
        href={`https://etherscan.io/address/${syndicateAddress}`}
        target="_blank"
        className="text-blue-cyan px-2 flex"
      >
        view on etherscan <ExternalLinkIcon className="ml-2" />
      </a>
      <div className="h-fit-content w-7/12  md:ml-2 mb-12">
        {syndicateBadge}
      </div>

      {/* Syndicate details 
      This component should be shown when we have details about user deposits */}
      {details ? (
        <DetailsCard
          {...{ title: "Details", sections: details }}
          customStyles={"pl-4 pr-2 w-full py-4 pb-8"}
          customInnerWidth="w-7/12"
        />
      ) : (
        ""
      )}
    </div>
  );
};

const mapStateToProps = ({ web3Reducer, syndicateDetailsReducer }) => {
  const { web3, depositMode, withdrawalMode } = web3Reducer;
  const { syndicateDetails, syndicateDetailsLoading } = syndicateDetailsReducer;

  return {
    web3,
    syndicateDetails,
    syndicateDetailsLoading,
    depositMode,
    withdrawalMode,
  };
};

SyndicateDetails.propTypes = {
  web3: PropTypes.any,
  syndicate: PropTypes.object,
};
export default connect(mapStateToProps)(SyndicateDetails);
