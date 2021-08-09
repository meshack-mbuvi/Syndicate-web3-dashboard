import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  title: "",
  message: "",
  renderUnavailableState: true,
};

const readonlyState = {
  title: readOnlySyndicateText,
  message: readOnlySyndicateTitle,
  renderUnavailableState: true,
};

const noAccountState = {
  title: connectWalletMessageTitle,
  message: connectWalletDepositMessage,
  renderUnavailableState: true,
};

export const useUnavailableState = (page?: string) => {
  const {
    syndicatesReducer: { syndicateAddressIsValid },
    web3Reducer: {
      web3: { account, web3 },
    },
  } = useSelector((state: RootState) => state);

  // DEFINITIONS
  const router = useRouter();
  const withdraw = router.pathname.endsWith("withdraw");

  const {
    depositsAvailable,
    maxMembersZero,
    maxDepositReached,
  } = useDepositChecks();

  const [{ title, message, renderUnavailableState }, setText] = useState(
    defaultState,
  );

  const [renderJoinWaitList, setRenderJoinWaitList] = useState(false);

  switch (page) {
    case "manage":
      useEffect(() => {
        if (web3 === null && syndicateAddressIsValid) {
          setRenderJoinWaitList(true);
        } else if (!account) {
          setText(noAccountState);
        } else {
          setText({ ...defaultState, renderUnavailableState: false });
        }
      }, [account, syndicateAddressIsValid]);
      break;

    default:
      useEffect(() => {
        if (web3 === null && syndicateAddressIsValid) {
          setRenderJoinWaitList(true);
        } else if (!account) {
          setText({
            ...noAccountState,
            message: withdraw
              ? connectWalletWithdrawMessage
              : noAccountState.message,
          });
        } else if (!depositsAvailable || maxMembersZero) {
          setText({
            title: depositsUnavailableTitleText,
            message: maxMembersZero
              ? depositsUnavailableMaxMembersZeroText
              : depositsUnavailableText,
            renderUnavailableState: true,
          });
        } else if (!depositsAvailable && !withdraw) {
          setText({
            title: depositsAndWithdrawalsUnavailableTitleText,
            message: depositsAndWithdrawalsUnavailableText,
            renderUnavailableState: true,
          });
        } else {
          setText({ ...defaultState, renderUnavailableState: false });
        }
      }, [account, syndicateAddressIsValid, depositsAvailable, maxMembersZero]);

      break;
  }

  return { title, message, renderUnavailableState, renderJoinWaitList };
};
