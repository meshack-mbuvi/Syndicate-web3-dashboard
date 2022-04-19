import ClubNameSelector from '@/containers/createInvestmentClub/clubNameSelector';
import AmountToRaise from '@/containers/createInvestmentClub/amountToRaise';
import MintMaxDate from '@/containers/createInvestmentClub/mintMaxDate';
import MembersCount from '@/containers/createInvestmentClub/membersCount';

export default [
  {
    component: <ClubNameSelector className="flex flex-col pb-6 w-full" />
  },
  {
    component: <AmountToRaise className="w-full" />
  },
  {
    component: <MintMaxDate className="w-full" />
  },
  {
    component: <MembersCount className="w-full" />
  },
  {
    component: <div></div>
  }
];
