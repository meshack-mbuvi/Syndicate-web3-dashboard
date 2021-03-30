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
    syndicate,
  } = props;
  const router = useRouter();

  const { allowlistEnabled } = syndicate;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [myLPDeposits, setMyLPDeposits] = useState<string>("0");

  console.log({ syndicate });
  const [mySyndicateshare, setMySyndicateShare] = useState<string>("0");
  const sections = [
    { header: "My Deposits", subText: myLPDeposits },
    { header: "My % of This Syndicate", subText: mySyndicateshare },
  ];

  /**
   * all syndicates are handled by the SyndicateSPV contract, so the contract
   * address is the same for all of them while the spvAddress that is passed
   * into the contract is different
   */
  const { syndicateAddress } = router.query;

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  const daiContract = new web3.eth.Contract(daiABI, daiContractAddress);

  const contract = new web3.eth.Contract(Syndicate.abi, contractAddress);

  /**
   * when an investment is made, this event will be fired. We process the data
   * and send it to the application state
   */
  contract.events.lpInvestedInSyndicate({}).on("data", (event) => {
    console.log({ ...event });
    // retrieve details of new investment and add them to state.
    // We might need find a way to store this data on our caching server.
    if (event.returnValues) {
      const {
        amountInvested,
        lpAddress,
        syndicateAddress,
      } = event.returnValues;

      dispatch(
        addSyndicateInvestments({ amountInvested, lpAddress, syndicateAddress })
      );
      getSyndicateLPInfo();
    }
  });

  /**
   * retrieve syndicateLPInfo to get wallet total deposits
   */
  useEffect(() => {
    if (syndicateInstance) {
      getSyndicateLPInfo();
    }
  }, [account, syndicateInstance]);

  /**
   * whenever we get syndicate details, we neet to trigger calculation of wallet
   * syndicate share.
   */
  useEffect(() => {
    if (syndicate) {
      calculateMyLPShare();
    }
  }, [syndicate]);

  /**
   * Calculates the % share of the wallet onwer(lpAddress) which is a ration of
   * the total investments made by the wallet to the total deposits made in the
   * syndicate. This value is then converted to %
   * @returns
   */
  const calculateMyLPShare = () => {
    if (!syndicate.totalDeposits) {
      return;
    }
    const MySyndicateShare =
      (parseInt(myLPDeposits) * 100) / syndicate.totalDeposits;
    setMySyndicateShare(`${MySyndicateShare} %`);
  };

  /**
   * Retrieves syndicateInfo for the connected wallet. We need to find out
   * how much the wallet account has invested in this syndicate, and then use
   * this date in calculateMyLPShare() above to caluclate the share of the account.
   * @returns
   */
  const getSyndicateLPInfo = async () => {
    if (!syndicateInstance) return;
    try {
      const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
        syndicateAddress,
        account
      );
      const myTotalLPDeposits = web3.utils.fromWei(
        syndicateLPInfo[0].toString()
      );
      console.log({ syndicateLPInfo, myTotalLPDeposits });
      setMyLPDeposits(`${myTotalLPDeposits} DAI`);
      calculateMyLPShare();
    } catch (error) {
      console.log({ error });
    }
  };

  contract.events
    .allEvents()
    .on("data", (event) => {
      console.log({ event });
    })
    .on("error", console.error);

  // Approve sending the daiBalance from the user to the manager. Note that the
  // approval goes to the contract, since that is what executes the transferFrom
  // call.
  // See https://forum.openzeppelin.com/t/uniswap-transferfrom-error-dai-insufficient-allowance/4996/4
  // and https://forum.openzeppelin.com/t/example-on-how-to-use-erc20-token-in-another-contract/1682
  // This prevents the error "Dai/insufficient-allowance"
  // Setting an amount specifies the approval level
  const approveManager = async (account, managerAddress, amount) => {
    const amountDai = toEther(amount).toString();

    try {
      await daiContract.methods
        .approve(managerAddress, amountDai)
        .call({ from: account, gasLimit: 800000 });

      // Check the approval amount
      const daiAllowance = await daiContract.methods
        .allowance(account.toString(), managerAddress)
        .call({ from: account });

      // Testing; should be removed
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
    setSubmitting(true);

    const { depositAmount, accredited } = data;

    const approvedAllowance = await approveManager(
      account,
      syndicateInstance.address,
      depositAmount
    );
    if (approvedAllowance === 0) {
      // inform user that his account does not have allowance to invest.
      setSubmitting(false);

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
      await syndicateInstance.lpInvestInSyndicate(
        syndicateAddress,
        amountToInvest,
        accredited,
        { from: account, gasLimit: 800000 }
      );
      setSubmitting(false);
    } catch (error) {
      // show error message for failed investment
      console.log({ error });
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
      <div className="h-fit-content rounded-t-md mx-2 lg:p-6 bg-gray-9 sm:ml-6 border border-b-0 border-gray-49">
        <p className="fold-bold text-xl p-4">Deposit Into Syndicate</p>

        <div className="px-2">
          {/* show this text if whitelist is enabled */}
          <p className="ml-4 py-4 text-green-screamin">
            {allowlistEnabled
              ? "Whitelist enabled: You’re pre-approved"
              : "Whitelist disabled: You will need to be approved"}
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

            {/* when form submittion is triggered, we show loader, otherwise
             we show submit button */}
            {submitting ? (
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-white h-4 w-4"></div>
            ) : (
              <button
                className={`flex w-full items-center justify-center font-medium rounded-md text-black bg-white focus:outline-none focus:ring py-4`}
                type="submit">
                Continue
              </button>
            )}

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

const mapStateToProps = ({ web3Reducer, syndicateInvestmentsReducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

InvestInSyndicate.propTypes = {
  web3: PropTypes.any,
  dispatch: PropTypes.any,
  syndicate: PropTypes.object,
};

export default connect(mapStateToProps)(InvestInSyndicate);
