import { ProgressModal, ProgressModalState } from "@/components/progressModal";

export default {
  title: "Molecules/Modify Club Settings/Progress Modal",
  argTypes: {
    state: {
      options: [ProgressModalState.FAILURE, ProgressModalState.PENDING, ProgressModalState.SUCCESS, ProgressModalState.CONFIRM],
      control: { type: 'select' },
    },
  },
};

const Template = (args) => <ProgressModal {...args} />

export const ConfirmInWallet = Template.bind({});
ConfirmInWallet.args = {
    isVisible: true,
    title: "Confirm in wallet",
    description: "Confirm the modification of club settings in your wallet",
    state: ProgressModalState.CONFIRM
};

export const Pending = Template.bind({});
Pending.args = {
    isVisible: true,
    title: "Pending confirmation",
    description: "This could take up to a few minutes depending on network congestion and the gas fees you set. Feel free to leave this screen.",
    etherscanLink: "#",
    buttonLabel: "Back to club dashboard",
    state: ProgressModalState.PENDING
};

export const Success = Template.bind({});
Success.args = {
    isVisible: true,
    title: "Transaction failed",
    description: "Please try again and let us know if the issue persists.",
    buttonLabel: "Back to club dashboard",
    state: ProgressModalState.SUCCESS
};

export const Failure = Template.bind({});
Failure.args = {
    isVisible: true,
    title: "Transaction failed",
    description: "Please try again and let us know if the issue persists.",
    buttonLabel: "Try again",
    state: ProgressModalState.FAILURE
};