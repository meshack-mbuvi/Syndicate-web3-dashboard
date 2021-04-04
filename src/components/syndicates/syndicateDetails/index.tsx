<<<<<<< HEAD:src/components/syndicates/syndicateDetails/index.tsx
import { useRouter } from "next/router";
=======
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "@reach/router";
>>>>>>> Process all events retrieving syndicates a wallet account has invested in and:src/components/syndicates/syndicateDetails/index.js
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ExternalLinkIcon } from "src/components/iconWrappers";
import { etherToNumber, formatDate, fromNumberToPercent } from "src/utils";
import { BadgeCard, DetailsCard } from "../shared";

const SyndicateDetails = (props) => {
  const {
    web3: { syndicateInstance, account },
  } = props;
  const router = useRouter();

<<<<<<< HEAD:src/components/syndicates/syndicateDetails/index.tsx
  const [syndicate, setSyndicate] = useState({
    maxDeposit: 0,
    profitShareToSyndicateProtocol: 0.3,
    openToDeposits: false,
    totalDeposits: 0,
    closeDate: "",
    inactive: true,
    createdDate: "",
  });
=======
  const [details, setDetails] = useState([]);
  const [openToDeposits, setOpenToDeposit] = useState(false);
  const [totalDeposits, setTotalDeposits] = useState(0);
<<<<<<< HEAD:src/components/syndicates/syndicateDetails/index.tsx
  console.log({ syndicate });
>>>>>>> Process all events retrieving syndicates a wallet account has invested in and:src/components/syndicates/syndicateDetails/index.js
=======
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/components/syndicates/syndicateDetails/index.js

  useEffect(() => {
    if (syndicate) {
      const {
        openToDeposits,
        totalDeposits,
        closeDate,
        createdDate,
        profitShareToSyndicateProtocol,
      } = syndicate;

      setOpenToDeposit(openToDeposits);
      setTotalDeposits(totalDeposits);

      setDetails([
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
    }
  }, [syndicate]);

  const { syndicateAddress } = router.query;

  useEffect(() => {
    if (syndicateInstance) {
      try {
        syndicateInstance
          .getSyndicateValues(syndicateAddress)
          .then((data) => {
            console.log({
              data,
              creationDate: data.creationDate.toNumber(),
              date: etherToNumber(data.closeDate),
              number: new Date(data.closeDate.toNumber()),
            });

            const closeDate = formatDate(new Date(data.closeDate.toNumber()));
            /**
             * block.timestamp which is the one used to save creationDate is in
             * seconds. We multiply by 1000 to convert to milliseconds and then
             * convert this to javascript date object
             */
            const createdDate = formatDate(
              new Date(data.creationDate.toNumber() * 1000)
            );

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

            setSyndicate(syndicateDetails);
          })
          .catch((err) => console.log({ err }));
      } catch (err) {
        console.log({ err });
      }
    }
  }, [syndicateInstance, account]);

  const { openToDeposits } = syndicate;

  return (
    <div className="w-full sm:w-2/3 h-fit-content px-2 md:px-0 rounded-md bg-gray-9">
      <div className="h-fit-content w-fit-content rounded-t-md bg-gray-9 md:ml-2">
        <span className="fold-bold px-2 text-gray-dim leading-loose text-xl uppercase">
          Syndicate
        </span>
        <p className="sm:text-2xl flex text-lg flex-wrap px-2 break-all">
          {syndicateAddress}
        </p>
        <a
          href={`https://etherscan.io/address/${syndicateAddress}`}
          target="_blank"
          className="text-blue-cyan px-2 flex">
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
      {details ? (
        <DetailsCard
          {...{ title: "Details", sections: details }}
          customStyles={"p-4 sm:w-2/3 sm:ml-12 py-4 border-b border-gray-49"}
        />
      ) : (
        ""
      )}

      {/* Total deposits */}
      <DetailsCard
        {...{
          title: "Deposits",
          sections: [
            {
              header: "Total Deposits",
              subText: syndicate?.totalDeposits,
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
  web3: PropTypes.any,
  syndicate: PropTypes.object,
};
export default connect(mapStateToProps)(SyndicateDetails);
