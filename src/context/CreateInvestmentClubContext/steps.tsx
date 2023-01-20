// active step to show on the left side nav dot indicator
export enum CreateActiveSteps {
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
