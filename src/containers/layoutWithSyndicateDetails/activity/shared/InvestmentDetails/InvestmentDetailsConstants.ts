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
  { text: "Ico", value: "ICO" },
  { text: "Other", value: "OTHER" },
  { text: "Public", value: "PUBLIC" },
  { text: "Seed", value: "SEED" },
  { text: "Series A", value: "SERIES_A" },
  { text: "Series B", value: "SERIES_B" },
  { text: "Series C", value: "SERIES_C" },
  { text: "Series D", value: "SERIES_D" },
  { text: "Series E", value: "SERIES_E" },
  { text: "Custom", value: "custom", icon: "plus-sign.svg" },
];
