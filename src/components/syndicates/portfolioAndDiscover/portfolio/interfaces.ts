export interface ifRows {
  row: {
    status: string;
    syndicateAddress: string;
    closeDate: string;
    createdDate: string;
    managerCurrent: string;
    depositERC20Address: string;
    depositors: number;
    depositMaxTotal: string;
    depositsEnabled: boolean;
    depositTotal: string;
    distributing: boolean;
    depositERC20TokenSymbol: string;
    tokenDecimals: number;
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
