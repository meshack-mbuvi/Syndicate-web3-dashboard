import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";

import { constants } from "../shared/Constants";
import { useDepositChecks } from "./useDepositChecks";

const {
  readOnlySyndicateText,
  readOnlySyndicateTitle,
  connectWalletMessageTitle,
  connectWalletDepositMessage,
  depositsUnavailableTitleText,
  depositsUnavailableText,
  depositsAndWithdrawalsUnavailableTitleText,
  depositsAndWithdrawalsUnavailableText,
  depositsUnavailableMaxMembersZeroText,
  connectWalletWithdrawMessage,
  } = constants;

const defaultState = {
  title: '',
  message: '',
  renderUnavailableState: true,
}

const readonlyState = {
  title: readOnlySyndicateText,
  message: readOnlySyndicateTitle,
  renderUnavailableState: true,
}

const noAccountState = {
  title: connectWalletMessageTitle,
  message: connectWalletDepositMessage,
  renderUnavailableState: true,
}


export const useUnavailableState = (page?: string) => {
  const {
    syndicatesReducer: { syndicateAddressIsValid },
    web3Reducer: {
      web3: { account },
      syndicateAction,
    },
  } = useSelector((state: RootState) => state);

  const { withdraw, deposit, generalView } = syndicateAction;
  const depositModes = deposit || generalView;

  const { depositsAvailable, maxLPsZero } = useDepositChecks();

  const [{title, message, renderUnavailableState}, setText] = useState(defaultState);

  switch (page) {
    case 'manage':
      useEffect(() => {
        if (Web3.givenProvider === null && syndicateAddressIsValid) {
          setText(readonlyState)
        } else if (!account) {
          setText(noAccountState)
        } else {
          setText({ ...defaultState,
            renderUnavailableState: false,
          })
        }
      }, [account, syndicateAddressIsValid])
      break;
              
    default:
      useEffect(() => {
        if (Web3.givenProvider === null && syndicateAddressIsValid) {
          setText(readonlyState)
        } else if (!account) {
          setText({
            ...noAccountState,
            message: withdraw ? connectWalletWithdrawMessage : noAccountState.message
          })
        } else if ((!depositsAvailable && depositModes) || (depositModes && maxLPsZero) ){
          setText({
            title: depositsUnavailableTitleText,
            message: maxLPsZero ? depositsUnavailableMaxMembersZeroText : depositsUnavailableText,
            renderUnavailableState: true,
          })
        } else if (!depositsAvailable && !withdraw){
          setText({
            title: depositsAndWithdrawalsUnavailableTitleText,
            message: depositsAndWithdrawalsUnavailableText,
            renderUnavailableState: true,
          })
        } else {
          setText({ ...defaultState,
            renderUnavailableState: false,
          })
        }
      }, [account, syndicateAddressIsValid])

      break;
  }

  return {title, message, renderUnavailableState}
}
