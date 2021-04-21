import { showWalletModal } from "@/redux/actions";
import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import Head from "src/components/syndicates/shared/HeaderTitle";

interface Props {
  dispatch: any;
  web3: any;
}

const GenerateDai = (props: Props) => {
  const daiABI = require("src/utils/abi/rinkeby-dai");
  const rinkebyDaiContractAddress =
    "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8";

  const [amount, setAmount] = useState("");

  const {
    web3: { web3, account },
  } = props;

  const onSubmit = async (event) => {
    event.preventDefault();

    /**
     * If the wallet is not connected, the account will be undefined
     */
    if (!account) {
      // Request wallet connect
      return props.dispatch(showWalletModal());
    }

    const daiContract = new web3.eth.Contract(
      daiABI,
      rinkebyDaiContractAddress
    );
    console.log({ daiAddres: daiContract._address });
    const balance = await daiContract.methods
      .balanceOf(account)
      .call({ from: account });
    console.log(
      "Balance before minting new DAI is " +
        web3.utils.fromWei(balance.toString())
    );

    const amountInWei = web3.utils.toWei(amount.toString());
    try {
      await daiContract.methods
        .mint(account, amountInWei)
        .send({ from: account, gasLimit: 800000 });

      const balance = await daiContract.methods
        .balanceOf(account)
        .call({ from: account });
      console.log(
        "Balance after minting new DAI is " +
          web3.utils.fromWei(balance.toString())
      );
      alert(
        "Minted " +
          amount +
          " DAI. Account balance is now " +
          web3.utils.fromWei(balance.toString()) +
          "!"
      );
    } catch (error) {
      console.log({ error });
      alert(
        "An error occurred while sending request to mint DAI. Please check the console to see the details"
      );
    }
  };

  return (
    <Layout>
      <Head title="Mint Rinkeby DAI" />
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Mint Rinkeby DAI"
      />

      <section className="flex flex-col content-center items-center justify-center md:flex-col">
        <div className="md:w-2/3 md:mr-8">
          <p className="mt-6 text-l text-warm-gray-500 max-w-3xl pb-5">
            This page is used to generate ERC-20s for the Rinkeby testnet. If
            you found this somehow, you should check out our{" "}
            <a
              href="https://www.notion.so/Syndicate-Protocol-Job-Postings-ad09c123121445339d6dfe0da4e3495e"
              className="text-gray-85 underline">
              job postings
            </a>
            .<br></br>
            The contract address for the Rinkeby DAI is{" "}
            <a
              href="https://rinkeby.etherscan.io/address/0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8"
              className="text-gray-85 underline">
              0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8
            </a>
          </p>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Mint new Rinkeby DAI
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Enter the amount of DAI you would like to generate and send to
                  yourself
                </p>
              </div>
              <form className="mt-5 sm:flex sm:items-center">
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="email" className="sr-only">
                    Amount
                  </label>
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Amount in ether"
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onSubmit}>
                  Mint!
                </button>
              </form>
            </div>
          </div>
        </div>

        <figure className="w-2/3 md:w-1/3"></figure>
      </section>
    </Layout>
  );
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps)(GenerateDai);
