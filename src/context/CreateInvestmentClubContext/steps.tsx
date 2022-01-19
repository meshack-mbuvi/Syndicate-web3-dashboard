import ClubNameSelector from "@/containers/createInvestmentClub/clubNameSelector";
import AmountToRaise from "@/containers/createInvestmentClub/amountToRaise";
import MintMaxDate from "@/containers/createInvestmentClub/mintMaxDate";
import MembersCount from "@/containers/createInvestmentClub/membersCount";

export default [
  {
    component: <ClubNameSelector className="flex flex-col pb-6 w-full lg:w-2/3" />,
  },
  {
    component: <AmountToRaise className="w-full lg:w-2/3" />,
  },
  {
    component: <MintMaxDate className="w-full lg:w-2/3" />,
  },
  {
    component: <MembersCount className="w-full lg:w-2/3" />,
  },
  {
    component: <div></div>,
  },
];
