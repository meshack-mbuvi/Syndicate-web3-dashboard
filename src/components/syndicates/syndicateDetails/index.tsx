import { floatedNumberWithCommas } from "@/utils/numberWithCommas";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { connect, useDispatch } from "react-redux";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";
// utils
import { formatAddress } from "src/utils/formatAddress";
import { TokenMappings } from "src/utils/tokenMappings";
import { BadgeCard, DetailsCard } from "../shared";
import {
  closeDateToolTip,
  createdDateToolTip,
  depositTokenToolTip,
  expectedAnnualOperatingFeesToolTip,
  profitShareToSyndicateLeadToolTip,
  profitShareToSyndicateProtocolToolTip,
  syndicateDetailsConstants,
} from "../shared/Constants";

const SyndicateDetails = (props: {
  web3: any;
  syndicateDetails: any;
  lpIsManager;
  syndicateContractInstance;
  syndicate;
}) => {
  const {
    web3: { syndicateInstance },
    syndicateDetails,
    syndicate,
  } = props;

  const dispatch = useDispatch();

  const router = useRouter();
  const [details, setDetails] = useState([
    {
      header: "Created on",
      subText: "",
      toolTip: "",
    },
    {
      header: "Close Date",
      subText: "",
      toolTip: "",
      isEditable: false,
    },
    {
      header: "Deposit/Distribution Token",
      subText: "",
      toolTip: "",
      isEditable: false,
    },
    {
      header: "Expected Annual Operating Fees",
      subText: "",
      toolTip: "",
      isEditable: false,
    },
    {
      header: "Profit Share to Syndicate Lead",
      subText: "",
      toolTip: "",
      isEditable: false,
    },
    {
      header: "Profit Share to Protocol",
      subText: "",
      toolTip: "",
      isEditable: false,
    },
  ]);

  // state to handle copying of the syndicate address to clipboard.
  const [showCopyState, setShowCopyState] = useState<boolean>(false);

  // state to handle details about the current ERC20 token
  const [tokenSymbol, setTokenSymbol] = useState<string>("DAI");

  // states to show general syndicate details
  const [
    syndicateCummulativeDetails,
    setSyndicateCummulativeDetails,
  ] = useState([
    {
      header: "Total Deposits",
      subText: "",
    },
  ]);

  // get syndicate address from the url
  const { syndicateAddress } = router.query;

  if (syndicate) {
    var {
      openToDeposits,
      distributionsEnabled,
      depositERC20ContractAddress,
    } = syndicate;
  }

  const {
    syndicateDetailsFooterText,
    syndicateDetailsLinkText,
  } = syndicateDetailsConstants;

  // get and set current token details
  useEffect(() => {
    if (depositERC20ContractAddress) {
      getERC20TokenDetails(depositERC20ContractAddress);
    }
  }, [syndicate, syndicateInstance]);

  // set syndicate cummulative values
  useEffect(() => {
    if (syndicate) {
      const { totalDeposits, totalDepositors } = syndicate;
      setSyndicateCummulativeDetails([
        {
          header: "Total Deposits",
          subText: `${floatedNumberWithCommas(
            totalDeposits
          )} ${tokenSymbol} (${totalDepositors} ${
            parseInt(totalDepositors) === 1 ? "depositor" : "depositors"
          })`,
        },
      ]);
    }
  }, [syndicate, syndicateDetails]);

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
        {
          header: "Created on",
          subText: createdDate,
          toolTip: createdDateToolTip,
        },
        {
          header: "Close Date",
          subText: closeDate,
          toolTip: closeDateToolTip,
        },
        {
          header: "Deposit/Distribution Token",
          subText: `${tokenSymbol} / ${tokenSymbol}`,
          toolTip: depositTokenToolTip,
        },
        {
          header: "Expected Annual Operating Fees",
          subText: `${managerManagementFeeBasisPoints}%`,
          toolTip: expectedAnnualOperatingFeesToolTip,
        },
        {
          header: "Profit Share to Syndicate Lead",
          subText: `${profitShareToSyndicateLead}%`,
          toolTip: profitShareToSyndicateLeadToolTip,
        },
        {
          header: "Profit Share to Protocol",
          subText: `${profitShareToSyndicateProtocol}%`,
          toolTip: profitShareToSyndicateProtocolToolTip,
        },
      ]);
    }
  }, [syndicate, syndicateDetails]);

  /**
   * method used to get details on the current ERC20 token
   */
  const getERC20TokenDetails = async (depositERC20ContractAddress: string) => {
    // getting token symbol doesn't seem to return a valid hex value
    // using this manual mapping for the time being
    const tokenAddress = depositERC20ContractAddress;
    const mappedTokenAddress = Object.keys(TokenMappings).find(
      (key) => key.toLowerCase() == tokenAddress.toLowerCase()
    );
    if (mappedTokenAddress) {
      setTokenSymbol(TokenMappings[mappedTokenAddress]);
    }
  };

  /**
   * Extracts some syndicate data and dispatches an action to set the details
   */
  useEffect(() => {
    if (syndicateInstance && syndicate) {
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
          syndicate,
          syndicateAddress
        )
      );
    }
  }, [syndicate, syndicateAddress]);

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
        syndicate,
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
          syndicate,
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
          syndicate,
          icon: (
            <span className="rounded-full bg-green-300 mt-2 w-4 h-4 ml-1"></span>
          ),
        }}
      />
    );
  }

  return (
    <div className="flex flex-col lg:w-3/5 w-full mr-2 lg:mr-6">
      <div
        className="h-fit-content p-6 md:p-10 rounded-custom bg-gray-6"
        style={{ border: "1px solid white" }}>
        <span className="font-bold px-2 text-gray-dim leading-4 text-sm uppercase">
          Syndicate
        </span>

        <div className="flex justif-start items-center">
          <p className="flex-shrink font-ibm text-xl sm:text-2xl md:text-lg lg:text-3xl flex-wrap pl-2 break-all">
            {formattedSyndicateAddress}
          </p>
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
          <p className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-16 md:w-16 ml-4 rounded-full ideo-liquidity inline"></p>
        </div>
        <div className="w-fit-content">
          <EtherscanLink contractAddress={syndicateAddress} />
        </div>
        <div className="h-fit-content flex w-full justify-start md:ml-2 mb-12">
          {syndicateBadge}
        </div>

        {/* Syndicate details 
      This component should be shown when we have details about user deposits */}
        <DetailsCard
          {...{
            title: "Details",
            sections: details,
            syndicateDetails: true,
            syndicate,
          }}
          customStyles={"pl-4 pr-2 w-full py-4 pb-8"}
          customInnerWidth="w-full"
        />
        <div className="w-full border-gray-49 border-t pt-4">
          <DetailsCard
            {...{
              title: "Deposits",
              sections: syndicateCummulativeDetails,
              syndicateDetails: true,
              infoIcon: false,
              syndicate,
            }}
            customStyles={"pl-4 pr-2 w-full py-4 pb-8"}
            customInnerWidth="w-full"
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  web3Reducer,
  syndicateDetailsReducer,
  syndicateInstanceReducer: { syndicateContractInstance },
}) => {
  const { web3, depositMode, withdrawalMode } = web3Reducer;
  const { syndicateDetails, syndicateDetailsLoading } = syndicateDetailsReducer;

  return {
    web3,
    syndicateDetails,
    syndicateDetailsLoading,
    depositMode,
    withdrawalMode,
    syndicateContractInstance,
  };
};

export default connect(mapStateToProps)(SyndicateDetails);
