import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/state/index";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import MemberDetailsModal from "@/containers/managerActions/mintAndShareTokens/MemberDetailsModal";
import { numberInputRemoveCommas } from "@/utils/formattedNumbers";

const client = new ApolloClient({
  uri: "#",
  cache: new InMemoryCache(),
});

export default {
  title:
    "Molecules/Cap Table Management/Modals/Add Member/Add Member Details Modal",
  parameters: {
    nextRouter: {
      query: {
        clubAddress: "0xA596dd3bC192990174fF2eC7f844f4225e20f61b",
      },
    },
  },
  decorators: [
    (Story) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
    ),
  ],
};

const Template = (args) => {
  const [amountToMint, setAmountToMint] = useState("0");
  const [memberAddress, setMemberAddress] = useState("");
  const handleAddressChange = (e) => {
    const addressValue = e.target.value;
    setMemberAddress(addressValue);
  };

  const handleAmountChange = (e) => {
    const amount = numberInputRemoveCommas(e);
    setAmountToMint(amount >= 0 ? amount : "");
  };
  return (
    <MemberDetailsModal
      {...args}
      {...{
        amountToMint,
        handleAmountChange,
        memberAddress,
        handleAddressChange,
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  show: true,
  symbol: "✺RACA",
};
