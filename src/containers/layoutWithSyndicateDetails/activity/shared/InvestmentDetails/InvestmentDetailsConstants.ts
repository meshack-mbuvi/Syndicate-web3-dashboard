import { RoundCategory } from "./../../../../../state/erc20transactions/types";
export const columns = [
  {
    Header: "Details",
    accessor: "Details",
  },
  {
    Header: "Company name",
    accessor: "company-name",
  },
  {
    Header: "Round",
    accessor: "round",
  },
  {
    Header: "Amount of shares",
    accessor: "amount-of-shares",
  },
  {
    Header: "Amount of tokens",
    accessor: "amount-of-tokens",
  },
  {
    Header: "Equity stake",
    accessor: "equity-stake",
  },
  {
    Header: "Acquisition date",
    accessor: "acqusition-date",
  },
  {
    Header: "Pre-money valuation",
    accessor: "pre-money-valuation",
  },
  {
    Header: "Post-money valuation",
    accessor: "post-money-valuation",
  },
];

export const investmentRounds: {
  text: string;
  value: string;
  icon?: string;
}[] = [
  { text: "Pre-seed", value: "Pre-seed" },
  { text: "Seed", value: "Seed" },
  { text: "Series A", value: "Series A" },
  { text: "Series B", value: "Series B" },
  { text: "Public", value: "Public" },
  { text: "Custom", value: "", icon: "plus-sign.svg" },
];
