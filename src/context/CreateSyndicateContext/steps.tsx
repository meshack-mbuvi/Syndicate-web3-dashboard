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
  DepositTokenInfo,
  FeesAndDistributionInfo,
  ModifiableInfo,
  TotalAndLimitsInfo,
  TransferableInfo,
} from "@/containers/create/onChainDetails/componentInfo";
import DepositToken from "@/containers/create/onChainDetails/depositToken";
import FeesAndDistribution from "@/containers/create/onChainDetails/distributionShare";
import Modifiable from "@/containers/create/onChainDetails/modifiable";
import TotalAndLimits from "@/containers/create/onChainDetails/totalAndLimits";
import Transferable from "@/containers/create/onChainDetails/transferable";
import PlaceHolder from "@/containers/create/placeHolder";
import Processing from "@/containers/create/processing";
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
        name: "Deposit token",
        component: <DepositToken />,
        contentInfo: <DepositTokenInfo />,
      },
      {
        name: "Total & limits",
        component: <TotalAndLimits />,
        contentInfo: <TotalAndLimitsInfo />,
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
    component: <Processing />,
  },
  {
    name: "Done",
    component: <PlaceHolder />,
  },
];
