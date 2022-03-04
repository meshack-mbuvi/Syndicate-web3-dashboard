import React from "react";
import { Provider } from "react-redux";
import { store } from "@/state/index";
import { MemberSelectDropdown } from "@/containers/managerActions/shared/memberSelectDropdown";

export default {
  title: "Molecules/Cap Table Management/Members filter dropdown",
  component: MemberSelectDropdown,
  argTypes: {
    numberOfMembers: { type: "number", defaultValue: 5 },
    showOuterBorder: { type: "boolean", defaultValue: false },
  },
  decorators: [
    (Story): React.ReactElement => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = ({ numberOfMembers, showOuterBorder, ...args }) => {
  // 8 dummy members for testing.
  const data = [
    {
      clubTokens: "3455",
      memberAddress: "0x9c6ce69f349430d31a2bfbe5a052fc3e48ad28cf",
      ownershipShare: 52.45,
    },
    {
      clubTokens: "455",
      memberAddress: "0xe4b343944C8da40E0FFA5ACadD27EA12fe608C3B",
      ownershipShare: 20,
    },
    {
      clubTokens: "55",
      memberAddress: "0xBCf2708F4Ca796cf87cEeCe81e5792Be13Ca2D79",
      ownershipShare: 1.455,
    },
    {
      clubTokens: "5",
      memberAddress: "0xd54f916AEBD6B5056127165f3349e7E7A8c86D32",
      ownershipShare: 1,
    },
    {
      clubTokens: "100",
      memberAddress: "0xe0bEA09d561bD0fCB0cF45576C96382c8f87a6c8",
      ownershipShare: 7,
    },
    {
      clubTokens: "200",
      memberAddress: "0xBF9C9FBd222d547A7D25A58D01D3cd1515335Db0",
      ownershipShare: 10.45,
    },
    {
      clubTokens: "4999",
      memberAddress: "0xA4B7C3d05A2E1938f825B29c61de1bc943565bE6",
      ownershipShare: 40,
    },
    {
      clubTokens: "3000",
      memberAddress: "0xA596dd3bC192990174fF2eC7f844f4225e20f61b",
      ownershipShare: 35,
    },
  ];

  let membersData = [];
  if (numberOfMembers > 8) {
    // in case someone wants to test with more than 8 members
    // duplicate last member and add to the list
    const lastMember = data[data.length - 1];
    const differenceInNumber = numberOfMembers - data.length;
    for (let i = 0; i < differenceInNumber; i++) {
      data.push(lastMember);
    }
  }
  membersData = data.slice(0, numberOfMembers);

  return (
    <div className={`rounded-1.5lg w-fit-content ${showOuterBorder? "border border-gray-syn5": ""}`}>
      <MemberSelectDropdown {...args} membersData={membersData} />
    </div>
  );
};
export const Default = Template.bind({});
