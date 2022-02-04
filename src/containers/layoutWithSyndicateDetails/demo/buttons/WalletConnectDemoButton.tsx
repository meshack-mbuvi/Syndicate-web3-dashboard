import React from "react";
import { useDemoMode } from "@/hooks/useDemoMode";

interface IWalletConnectDemoButton {
  buttonText: string;
  alignment?: string;
}

const WalletConnectDemoButton: React.FC<IWalletConnectDemoButton> = ({
  buttonText,
  alignment = "justify-center",
}) => {
  const isDemoMode = useDemoMode();

  if (isDemoMode) return null;

  return (
    <a href="/clubs/demo/manage" target="_blank">
      <span
        className={`text-green-volt bg-green-volt bg-opacity-10 p-4 rounded-custom flex ${alignment} items-center w-full cursor-pointer`}
      >
        <span className="mr-2">{buttonText}</span>
        <img src="/images/status/gamecontroller.svg" alt="demo icon" />
      </span>
    </a>
  );
};

export default WalletConnectDemoButton;
