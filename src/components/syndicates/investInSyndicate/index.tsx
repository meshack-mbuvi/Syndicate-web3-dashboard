import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import Syndicate from "src/contracts/Syndicate.json";
// action to initiate wallet connect
import { showWalletModal } from "src/redux/actions/web3Provider";
// utils
import { toEther } from "src/utils";
import { DetailsCard } from "../shared";
import { depositSchema } from "../validators";

const Web3 = require("web3");

const daiABI = require("src/utils/abi/dai");

const contractAddress = process.env.GATSBY_SPV_CONTRACT_ADDRESS;
const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

const InvestInSyndicate = (props) => {
  const {
    web3: { syndicateInstance, account },
    dispatch,
  } = props;
  const router = useRouter();

  /**
   * all syndicates are handled by the SyndicateSPV contract, so the contract
   * address is the same for all of them while the spvAddress that is passed
   * into the contract is different
   */
  const { spvAddress } = router.query;

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  web3.eth.defaultAccount = web3.eth.accounts[0];

  const daiContract = new web3.eth.Contract(daiABI, daiContractAddress);

  const contract = new web3.eth.Contract(Syndicate.abi, contractAddress);
  console.log(account);
  contract.events.lpInvestedInSyndicate({}).on("data", (event) => {
    console.log({ event });
  });
  contract.events
    .allEvents()
    .on("data", (event) => {
      console.log({ event });
    })
    .on("error", console.error);

  // this should be updated after Syndicate details are retrieved
  const [sections] = useState([
    { header: "My Deposits", subText: "0" },
    { header: "My % of This Syndicate", subText: "0" },
  ]);

  const events = contract.events.allEvents({ address: account }, (data) =>
    console.log({ data })
  ); // get all events
  console.log({ events });

  // Approve sending the daiBalance from the user to the manager. Note that the
  // approval goes to the contract, since that is what executes the transferFrom
  // call.
  // See https://forum.openzeppelin.com/t/uniswap-transferfrom-error-dai-insufficient-allowance/4996/4
  // and https://forum.openzeppelin.com/t/example-on-how-to-use-erc20-token-in-another-contract/1682
  // This prevents the error "Dai/insufficient-allowance"
  // Setting an amount specifies the approval level
  const approveManager = async (account, managerAddress, amount) => {
    // 100 is for testing
    const amountDai = toEther(amount).toString();

    try {
      await daiContract.methods
        .approve(managerAddress, amountDai)
        .call({ from: account, gasLimit: 800000 });

      // Check the approval amount
      const daiAllowance = await daiContract.methods
        .allowance(account.toString(), managerAddress)
        .call({ from: account });

      console.log("daiAllowance is " + daiAllowance);
      return daiAllowance;
    } catch (approveError) {
      console.log({ approveError });
      return 0;
    }
  };

  useEffect(() => {
    /**
     * When contract instance is null or undefined, we can't access syndicate
     * address so we need to connect to wallet first which will handle contract
     * instantiation.
     */
    if (!syndicateInstance) {
      dispatch(showWalletModal());
    }
  }, [syndicateInstance]);

  const { register, handleSubmit } = useForm({
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

    const { depositAmount, accredited } = data;

    const approvedAllowance = await approveManager(
      account,
      syndicateInstance.address,
      depositAmount
    );
    if (approvedAllowance === 0) {
      // inform user that his account does not have allowance to invest.
      return;
    }

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
      const amountToInvest = toEther(depositAmount);
      console.log({ amountToInvest: amountToInvest.toString() });
      await syndicateInstance.lpInvestInSyndicate(
        spvAddress,
        amountToInvest,
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
                  <img src="/images/usdcIcon.svg" />
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
              type="submit">
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
  web3: PropTypes.any,
  dispatch: PropTypes.any,
};

export default connect(mapStateToProps)(InvestInSyndicate);
