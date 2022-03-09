import { ProgressModal, ProgressModalState } from "@/components/progressModal";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";

export default {
  title: "Molecules/Cap Table Management/Modals/Modify Member Tokens/Modify Member Progress Modals",
  argTypes: {
    state: {
      options: [
        ProgressModalState.FAILURE,
        ProgressModalState.PENDING,
        ProgressModalState.SUCCESS,
        ProgressModalState.CONFIRM,
      ],
      control: { type: "select" },
    },
  },
};

const Template = (args) => {
  return <ProgressModal {...args} />;
};

export const ConfirmInWallet = Template.bind({});
ConfirmInWallet.args = {
  isVisible: true,
  title: "Confirm in wallet",
  description: "Please confirm the cap table modification from your wallet.",
  state: ProgressModalState.CONFIRM,
};

export const Pending = Template.bind({});
Pending.args = {
  isVisible: true,
  title: "Updating cap table",
  description:
    "This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.",
  transactionHash: "#",
  transactionType: "transaction",
  state: ProgressModalState.PENDING,
};

export const Success = Template.bind({});
Success.args = {
  isVisible: true,
  title: "Cap table updated",
  description: `${formatAddress(
    "0x2502947319f2166eF46f0a7c081D23C63f88112B",
    6,
    4,
  )}'s club token
    allocation has been changed to ${floatedNumberWithCommas(3233) || 0} ✺RACA`,
  buttonLabel: "Done",
  buttonFullWidth: true,
  state: ProgressModalState.SUCCESS,
  transactionHash: "#",
  transactionType: "transaction",
};

export const Failure = Template.bind({});
Failure.args = {
  isVisible: true,
  title: "Cap table update failed",
  description: "",
  buttonLabel: "Close",
  buttonFullWidth: true,
  state: ProgressModalState.FAILURE,
  transactionHash: "#",
  transactionType: "transaction",
};
