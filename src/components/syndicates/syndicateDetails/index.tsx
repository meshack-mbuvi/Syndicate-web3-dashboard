import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import moment from "moment";

import { ExternalLinkIcon } from "src/components/iconWrappers";

import { BadgeCard, DetailsCard } from "../shared";
import { etherToNumber, fromNumberToPercent } from "src/utils";

const SyndicateDetails = (props) => {
  const {
    web3: { syndicateInstance, account },
    dispatch,
  } = props;
  const router = useRouter();

  console.log({ props });

  const [syndicateSPV, setSyndicateSPV] = useState({
    maxDeposit: 0,
    profitShareToSyndicateProtocol: 0.3,
    openToDeposits: false,
    totalDeposits: 0,
    closeDate: "",
    inactive: true,
    createdDate: "",
  });

  const [detailSections, setSections] = useState([
    { header: "Created on", subText: syndicateSPV.createdDate },
    { header: "Close Date", subText: syndicateSPV.closeDate },
    { header: "Deposit/Distribution Token", subText: "USDC / USDC" },
    {
      header: "Profit Share to Syndicate Leads",
      subText: syndicateSPV.profitShareToSyndicateProtocol,
    },
    {
      header: "Profit Share to Protocol",
      subText: syndicateSPV.profitShareToSyndicateProtocol,
    },
  ]);

  const { spvAddress } = router.query;

  useEffect(() => {
    if (syndicateInstance) {
      try {
        syndicateInstance
          .getSyndicateValues(spvAddress)
          .then((data) => {
            console.log(data);
            const closeDate = moment(data.closeDate).format("DD/MM/YYYY");
            const createdDate = moment(data.creationDate).format("DD/MM/YYYY");

            const maxDeposit = data.maxDeposit.toString();
            const profitShareToSyndicateProtocol = fromNumberToPercent(
              etherToNumber(data.syndicateProfitSharePercent.toString())
            );
            const openToDeposits = data.spvOpen;
            const totalDeposits = etherToNumber(data.totalDeposits.toString());

            const syndicateDetails = {
              maxDeposit,
              profitShareToSyndicateProtocol,
              openToDeposits,
              totalDeposits,
              closeDate,
              inactive: data.inactive,
              createdDate: "",
            };

            setSyndicateSPV(syndicateDetails);

            // update detail sections
            setSections([
              { header: "Created on", subText: createdDate },
              { header: "Close Date", subText: closeDate },
              { header: "Deposit/Distribution Token", subText: "USDC / USDC" },
              {
                header: "Profit Share to Syndicate Leads",
                subText: profitShareToSyndicateProtocol,
              },
              {
                header: "Profit Share to Protocol",
                subText: profitShareToSyndicateProtocol,
              },
            ]);
          })
          .catch((err) => console.log({ err }));
      } catch (err) {
        console.log({ err });
      }
    }
  }, [syndicateInstance, account]);
  console.log({ syndicateSPV, detailSections });

  const { openToDeposits } = syndicateSPV;

  return (
    <div className="w-full sm:w-2/3 h-fit-content px-2 md:px-0 rounded-md bg-gray-9">
      <div className="h-fit-content w-fit-content rounded-t-md bg-gray-9 md:ml-2">
        <span className="fold-bold px-2 text-gray-dim leading-loose text-xl uppercase">
          Syndicate
        </span>
        <p className="sm:text-2xl flex text-lg flex-wrap px-2 break-all">
          {spvAddress}
        </p>
        <a
          href={`https://etherscan.io/address/${spvAddress}`}
          target="_blank"
          className="text-blue-cyan px-2 flex"
        >
          view on etherscan <ExternalLinkIcon className="ml-2" />
        </a>

        {openToDeposits ? (
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
        ) : (
          <BadgeCard
            {...{
              title: "Status",
              subTitle: "Close to Deposits",
              text: "Depositing not available",
              icon: (
                <span className="rounded-full bg-yellow-300 mt-2 w-4 h-4 ml-1"></span>
              ),
            }}
          />
        )}

        <BadgeCard
          {...{
            title: "Badges (NFTs)",
            subTitle: "Alpha",
            text: "Among the first syndicates on Syndicate",
            icon: (
              <span className="mt-2 ml-1">
                <img src="/images/blueIcon.svg" />
              </span>
            ),
          }}
        />
      </div>

      {/* Syndicate details 
      This component should be shown when we have details about user deposits */}
      <DetailsCard
        {...{ title: "Details", sections: detailSections }}
        customStyles={"p-4 sm:w-2/3 sm:ml-12 py-4 border-b border-gray-49"}
      />

      {/* Total deposits */}
      <DetailsCard
        {...{
          title: "Deposits",
          sections: [
            {
              header: "Total Deposits",
              subText: syndicateSPV.totalDeposits,
            },
          ],
        }}
        customStyles={"px-4 sm:w-2/3 sm:ml-12 py-8 border-gray-49"}
      />
    </div>
  );
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

SyndicateDetails.propTypes = {
  props: PropTypes.any,
};
export default connect(mapStateToProps)(SyndicateDetails);
