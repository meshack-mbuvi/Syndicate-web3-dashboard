export interface ifRows {
  row: {
    status: string;
    syndicateAddress: string;
    closeDate: string;
    createdDate: string;
    isOwner: boolean;
    depositERC20Address: string;
    depositors: number;
    depositTotalMax: string;
    depositsEnabled: boolean;
    totalDeposits: string;
    distributing: boolean;
    depositERC20TokenSymbol: string;
    tokenDecimals: number;
    depositAmount: string;
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
