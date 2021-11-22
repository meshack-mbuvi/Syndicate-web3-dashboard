import { showWalletModal } from "@/state/wallet/actions";
import { AppState } from "@/state";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toggle } from "src/components/inputs";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import Head from "src/components/syndicates/shared/HeaderTitle";
import { getWeiAmount } from "src/utils/conversions";

const GenerateDai: React.FC = () => {
  const daiABI = require("src/utils/abi/rinkeby-dai");
  const erc20ABI = require("src/utils/abi/erc20");
  const daiContractAddress = "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8";
  const usdcContractAddress = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";

  const [amount, setAmount] = useState("");
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  const [tokenContractAddressError, setTokenContractAddressError] =
    useState("");
  const [daiSelected, setDaiSelected] = useState(false);
  const [usdcSelected, setUSDCSelected] = useState(false);
  const [otherSelected, setOtherSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CONTEXT === "production") {
      router.replace("/");
    }
  }, []);

  const {
    web3Reducer: {
      web3: { account, web3 },
    },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const toggleOff = () => {
    setDaiSelected(false);
    setUSDCSelected(false);
    setOtherSelected(false);
  };

  const toggleDAISelected = () => {
    toggleOff();
    setDaiSelected(true);
    setTokenContractAddress(daiContractAddress);
  };
  const toggleUSDCSelected = () => {
    toggleOff();
    setUSDCSelected(true);
    setTokenContractAddress(usdcContractAddress);
  };

  const toggleOTHERSelected = () => {
    toggleOff();
    setOtherSelected(true);
    setTokenContractAddress("");
  };

  const handleCustomERC20TokenAddress = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const { value } = event.target;
    setTokenContractAddress(value);

    if (!value.trim()) {
      setTokenContractAddressError("Token contract Address is required");
    } else if (!web3.utils.isAddress(value)) {
      setTokenContractAddressError(
        "Token Contract Address should be a valid ERC20 address",
      );
    } else {
      setTokenContractAddressError("");
    }
  };

  const validateAndSubmit = (event: any) => {
    event.preventDefault();
    if (
      tokenContractAddress !== "" &&
      tokenContractAddressError === "" &&
      Number(amount) > 0
    ) {
      mintToken();
    } else {
      alert("Enter valid inputs");
    }
  };

  const mintToken = async () => {
    setIsLoading(true);

    /**
     * If the wallet is not connected, the account will be undefined
     */
    if (!account) {
      setIsLoading(false);
      // Request wallet connect
      return dispatch(showWalletModal());
    }

    let tokenABI = erc20ABI;

    if (tokenContractAddress === daiContractAddress) {
      tokenABI = daiABI;
    }

    const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

    let tokenDecimals;
    try {
      tokenDecimals = await tokenContract.methods.decimals().call();
    } catch {
      tokenDecimals = 18;
    }

    const amountInWei = getWeiAmount(amount, tokenDecimals, true);

    try {
      await tokenContract.methods
        .mint(account, amountInWei)
        .send({ from: account });

      const balance = await tokenContract.methods
        .balanceOf(account)
        .call({ from: account });

      setIsLoading(false);
      alert(
        "Minted " +
          amount +
          " Token. Account balance is now " +
          getWeiAmount(balance.toString(), tokenDecimals, false) +
          "!",
      );
    } catch (error) {
      setIsLoading(false);
      console.log({ error });
      alert(
        "An error occurred while sending request to mint Token. Please check the console to see the details",
      );
    }
  };

  return (
    <Layout>
      <Head title="Mint Rinkeby Tokens" />
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Mint Rinkeby TokenS"
      />

      <section className="flex flex-col content-center items-center justify-center md:flex-col">
        <div className="md:w-2/3 md:mr-8">
          <div className="mt-6 text-l text-warm-gray-500 max-w-3xl pb-5">
            This page is used to generate ERC-20s for the Rinkeby testnet. If
            you found this somehow, you should check out our{" "}
            <a
              href="https://www.notion.so/Syndicate-Protocol-Job-Postings-ad09c123121445339d6dfe0da4e3495e"
              className="text-gray-85 underline"
            >
              job postings
            </a>
            .<br></br>
            <br></br>
            The contract addresses for the Rinkeby DAI and USDC are:
            <br />
            <div>
              DAI &nbsp;
              <a
                href={`https://rinkeby.etherscan.io/address/${daiContractAddress}`}
                className="text-gray-85 underline"
              >
                {daiContractAddress}
              </a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button
                className="self-center"
                onClick={() =>
                  navigator.clipboard.writeText(daiContractAddress)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 29 15"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button>
            </div>
            <div>
              USDC &nbsp;
              <a
                href={`https://rinkeby.etherscan.io/address/${usdcContractAddress}`}
                className="text-gray-85 underline"
              >
                {usdcContractAddress}
              </a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button
                className="self-center"
                onClick={() =>
                  navigator.clipboard.writeText(usdcContractAddress)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 29 15"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Mint new Rinkeby TOKEN
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Enter the amount of selected token you would like to generate
                  and send to yourself
                </p>
              </div>
              <form className="mt-5 sm:flex sm:items-center flex-wrap">
                <div className="w-full sm:max-w-xs mb-2">
                  <Toggle
                    {...{
                      enabled: daiSelected,
                      toggleEnabled: toggleDAISelected,
                      label: "Mint DAI:",
                      tooltip: "",
                    }}
                  />
                  <Toggle
                    {...{
                      enabled: usdcSelected,
                      toggleEnabled: toggleUSDCSelected,
                      label: "Mint USDC:",
                      tooltip: "",
                    }}
                  />
                  <Toggle
                    {...{
                      enabled: otherSelected,
                      toggleEnabled: toggleOTHERSelected,
                      label: "Mint ERC20:",
                      tooltip: "",
                    }}
                  />
                </div>
                {otherSelected && (
                  <div className="w-full sm:max-w-xs mb-2">
                    <label htmlFor="email" className="sr-only">
                      Token
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="shadow-sm focus:ring-indigo-500 font-whyte focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Token Address"
                      onChange={handleCustomERC20TokenAddress}
                      disabled={isLoading}
                      required
                    />
                    <p className="text-red-500 text-xs mt-1 mb-1">
                      {tokenContractAddressError !== "" &&
                        tokenContractAddressError}
                    </p>
                  </div>
                )}
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="email" className="sr-only">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="amount"
                    id="amount"
                    className="shadow-sm focus:ring-indigo-500 font-whyte focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Amount to mint"
                    onChange={(event) => setAmount(event.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                {!isLoading ? (
                  <button
                    type="submit"
                    className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={validateAndSubmit}
                  >
                    Mint!
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled
                  >
                    Minting!
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <figure className="w-2/3 md:w-1/3"></figure>
      </section>
    </Layout>
  );
};

export default GenerateDai;
