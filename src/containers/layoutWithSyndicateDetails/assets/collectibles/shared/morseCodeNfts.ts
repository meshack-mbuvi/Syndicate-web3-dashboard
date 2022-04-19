// gift morse code nfts.
// add more nfts or more display criteria here.
export const morseCodeNftsDetails = [
  {
    image: 'alpha.svg',
    displayCriteria: {
      clubDepositAmount: {
        minTotalDeposit: 1,
        maxTotalDeposit: 10000
      }
    }
  },
  {
    image: 'beta.svg',
    displayCriteria: {
      clubDepositAmount: {
        minTotalDeposit: 10001,
        maxTotalDeposit: 100000
      }
    }
  },
  {
    image: 'gamma.svg',
    displayCriteria: {
      clubDepositAmount: {
        minTotalDeposit: 100001,
        maxTotalDeposit: 1000000
      }
    }
  },
  {
    image: 'delta.svg',
    displayCriteria: {
      clubDepositAmount: {
        minTotalDeposit: 1000001
      }
    }
  }
];

export type DisplayCriteria = {
  clubDepositAmount: {
    minTotalDeposit: number;
    maxTotalDeposit?: number;
  };
};
