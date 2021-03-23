import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import usdcIcon from "src/images/usdcIcon.svg";
import { useParams } from "@reach/router";

import { joiResolver } from "@hookform/resolvers/joi";
import { depositSchema } from "../validators";

// action to initiate wallet connect
import { showWalletModal } from "src/redux/actions/web3Provider";
import { DetailsCard } from "../shared";

const InvestInSyndicate = (props) => {
  const {
    web3: { syndicateInstance, account },
    dispatch,
  } = props;

  // this should be updated after Syndicate details are retrieved
  const [sections, setSections] = useState([
    { header: "My Deposits", subText: "0" },
    { header: "My % of This Syndicate", subText: "0" },
  ]);

  /**
   * all syndicates are handled by the SyndicateSPV contract, so the contract
   * address is the same for all of them while the spvAddress that is passed
   * into the contract is different
   */
  const { spvAddress } = useParams();

  useEffect(() => {
    /**
     * When contract instance is null or undefined, we can't access syndicate
     * address so we need to connect to wallet first which will handle contract
     * instantiation.
     */
    if (!syndicateInstance) {
      dispatch(showWalletModal());
    } else {
      // setSyndicateAddress(contract.address);
    }
  }, [syndicateInstance]);

  const { register, handleSubmit, errors } = useForm({
    resolver: joiResolver(depositSchema),
  });

  /**
   * This methods is used to invest in LP(syndicate)
   * The account that is investing is obtained from the connected wallet from
   * which funds will be transferred.
   *
   * Note: For a user to invest in LP, s/he must be an accredited investor,
   * which we get from the checkbox on this form
   *
   * The LpAddress is obtained from the page params
   * @param {object} data contains depositAmount, and accredited
   */
  const onSubmit = async (data) => {
    if (!syndicateInstance) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }
    console.log({ data });
    const { depositAmount, accredited } = data;

    try {
      /**
       * All addresses are allowed, and investments can be rejected after the
       * fact. This is useful if you want to allow anyone to invest in an SPV
       *  (for example, for a non-profit might enable this because there is
       * no expectation of profits and therefore they wouldn't need to be as
       * concerned about US securities regulations)
       * Addresses must be pre-approved by the manager and added to the
       * allowlist before an LP can invest.
       */

      /**
       * If deposit amount exceeds the allowed investment deposit, this will fail.
       */
      await syndicateInstance.lpInvestInSPV(
        spvAddress,
        depositAmount,
        accredited,
        { from: account, gasLimit: 800000 }
      );
    } catch (error) {
      // show error message for failed investment
      console.log({ error });
    }
  };

  return (
    <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
      <div className="h-fit-content rounded-t-md mx-2 lg:p-6 bg-gray-9 sm:ml-6 border border-b-0 border-gray-49">
        <p className="fold-bold text-xl p-4">Deposit Into Syndicate</p>

        <div className="px-2">
          {/* show this text if whitelist is enabled */}
          <p className="ml-4 py-4 text-green-screamin">
            Whitelist enabled: You’re pre-approved
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between my-1">
              <input
                name="depositAmount"
                type="text"
                placeholder="400"
                ref={register}
                className="rounded-md bg-gray-9 border border-gray-24 text-white focus:outline-none focus:ring-gray-24 focus:border-gray-24 font-ibm"
              />

              {/* In the new design, this would be a drop down from which
               a user selects currency */}
              <p className="flex justify-between pt-2">
                <span className="mx-2">
                  <img src={usdcIcon} />
                </span>
                USDC
              </p>
            </div>

            {/* checkbox for user to confirm they are accredited investor */}
            <div className="flex mt-4">
              <input
                type="checkbox"
                name="accredited"
                ref={register}
                className="mt-1 rounded-md focus:ring-0"
              />
              <span className="ml-4">I’m an accredited investor</span>
            </div>

            <p className="text-sm my-5 text-gray-dim">
              By depositing tokens, you attest you are accredited below to join
              this syndicate. After depositing, contact the syndicate leads to
              confirm receipt and withdraw timing.
            </p>

            <button
              className={`flex w-full items-center justify-center font-medium rounded-md text-black bg-white focus:outline-none focus:ring py-4`}
              type="submit"
            >
              Continue
            </button>

            <div className="flex justify-center">
              <div className="w-2/3 text-sm my-5 text-gray-dim justify-self-center text-center">
                Deposits can only be changed while the Syndicate is open. After
                the manager closes the Syndicate, all deposits are final and
                cannot be changed
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* This component should be shown when we have details about user deposits */}
      {/* <div className="ml-6 border border-gray-49"> */}
      <DetailsCard
        {...{ title: "MyStats", sections }}
        customStyles={
          "sm:ml-6 p-4 mx-2 sm:px-8 sm:py-4 sm:ml-0 rounded-b-md border border-gray-49"
        }
      />
      {/* </div> */}
    </div>
  );
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

InvestInSyndicate.propTypes = {
  props: PropTypes.any,
};

export default connect(mapStateToProps)(InvestInSyndicate);
