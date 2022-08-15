import ClubNameSelector from '@/containers/createInvestmentClub/clubNameSelector';
import AmountToRaise from '@/containers/createInvestmentClub/amountToRaise/AmountToRaise';
import MintMaxDate from '@/containers/createInvestmentClub/mintMaxDate';
import MembersCount from '@/containers/createInvestmentClub/membersCount';
import Membership from '@/containers/createInvestmentClub/membership';
import GettingStarted from '@/containers/createInvestmentClub/gettingStarted';

// active step to show on the left side nav dot indicator
export enum CreateActiveSteps {
  START = 'Start',
  NAME_AND_IDENTITY = 'Name & identity',
  CLUB_DETAILS = 'Club details',
  MEMBERSHIP = 'Membership',
  REVIEW = 'Review'
}

export enum DetailsSteps {
  MEMBERS_COUNT = 'members_count',
  RAISE = 'raise',
  DATE = 'date'
}

export type CreateSteps = CreateActiveSteps | DetailsSteps;
const CreateSteps = { ...CreateActiveSteps, ...DetailsSteps };
export interface CategorySteps {
  category: CreateActiveSteps;
  step: CreateSteps;
}

// steps for investment club
export const investmentClubSteps: CategorySteps[] = [
  {
    category: CreateActiveSteps.START,
    step: CreateSteps.START
  },
  {
    category: CreateActiveSteps.NAME_AND_IDENTITY,
    step: CreateSteps.NAME_AND_IDENTITY
  },
  {
    category: CreateActiveSteps.CLUB_DETAILS,
    step: CreateSteps.RAISE
  },
  {
    category: CreateActiveSteps.CLUB_DETAILS,
    step: CreateSteps.DATE
  },
  {
    category: CreateActiveSteps.CLUB_DETAILS,
    step: CreateSteps.MEMBERS_COUNT
  },
  {
    category: CreateActiveSteps.MEMBERSHIP,
    step: CreateSteps.MEMBERSHIP
  },
  {
    category: CreateActiveSteps.REVIEW,
    step: CreateSteps.REVIEW
  }
];

export const CreateStep = {
  Start: <GettingStarted />,
  'Name & identity': <ClubNameSelector className="w-full" />,
  Membership: <Membership className="flex flex-col pb-12 w-full" />,
  Review: <></>,
  raise: <AmountToRaise className="w-full" />,
  date: <MintMaxDate className="w-full" />,
  members_count: <MembersCount className="w-full" />
};

export const CreateFlowSteps = (step: CreateSteps) => {
  return <>{CreateStep[step]}</>;
};
