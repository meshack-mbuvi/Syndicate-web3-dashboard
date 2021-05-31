export interface ifRows {
  row: {
    active: boolean;
    activities: number;
    syndicateAddress: string;
    closeDate: string;
    createdDate: string;
    currentManager: string;
    depositERC20ContractAddress: string;
    depositors: number;
    maxTotalDeposits: string;
    openToDeposits: boolean;
    totalDeposits: string;
    distributionsEnabled: boolean;
  };
}

export interface HeaderColumn {
  accessor: string | (() => string);
  Header?: string | (() => JSX.Element | string);
  Filter?: string | (() => JSX.Element | string);
  Cell?: string | (() => JSX.Element | string);
  id?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  width?: string | number;
  showSort?: boolean | string;
}
