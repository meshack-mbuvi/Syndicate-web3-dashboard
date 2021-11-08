import ClubNameSelector from "@/containers/createInvestmentClub/clubNameSelector";
import AmountToRaise from "@/containers/createInvestmentClub/amountToRaise";
import MintMaxDate from "@/containers/createInvestmentClub/mintMaxDate";
import MembersCount from "@/containers/createInvestmentClub/membersCount";

export default [
  {
    component: <ClubNameSelector />,
  },
  {
    component: <AmountToRaise />,
  },
  {
    component: <MintMaxDate />,
  },
  {
    component: <MembersCount />,
  },
  {
    component: <div></div>,
  },
];
