import Confirmation, {
  ConfirmationInfo,
} from "@/containers/create/confirmation";
import {
  OffChainDataInfo,
  SyndicateType,
} from "@/containers/create/offchainData";
import Allowlist from "@/containers/create/onChainDetails/allowlist";
import CloseDateAndTime from "@/containers/create/onChainDetails/closeDate";
import {
  AllowListInfo,
  CloseDateInfo,
  DepositAndLimitInfo,
  FeesAndDistributionInfo,
  ModifiableInfo,
  TransferableInfo,
} from "@/containers/create/onChainDetails/componentInfo";
import DepositTokenAndLimit from "@/containers/create/onChainDetails/depositTokenAndLimits";
import FeesAndDistribution from "@/containers/create/onChainDetails/feesAndDistribution";
import Modifiable from "@/containers/create/onChainDetails/modifiable";
import Transferable from "@/containers/create/onChainDetails/transferable";
import PlaceHolder from "@/containers/create/placeHolder";
import React from "react";

export default [
  {
    name: "Off-chain details",
    subSteps: [
      {
        name: "Creator info",
        component: <SyndicateType />,
        contentInfo: <OffChainDataInfo />,
      },
    ],
  },
  {
    name: "On-chain details",
    subSteps: [
      {
        name: "Deposit token & limits",
        component: <DepositTokenAndLimit />,
        contentInfo: <DepositAndLimitInfo />,
      },
      {
        name: "Close date & time",
        component: <CloseDateAndTime />,
        contentInfo: <CloseDateInfo />,
      },
      {
        name: "Distribution share",
        component: <FeesAndDistribution />,
        contentInfo: <FeesAndDistributionInfo />,
      },
      {
        name: "Permissions",
        component: <Allowlist />,
        contentInfo: <AllowListInfo />,
      },
      {
        name: "Modifiable",
        component: <Modifiable />,
        contentInfo: <ModifiableInfo />,
      },
      {
        name: "Transferable",
        component: <Transferable />,
        contentInfo: <TransferableInfo />,
      },
    ],
  },
  {
    name: "Confirm details",
    component: <Confirmation />,
    contentInfo: <ConfirmationInfo />,
  },
  {
    name: "Processing",
    component: <PlaceHolder />,
  },
  {
    name: "Done",
    component: <PlaceHolder />,
  },
];
