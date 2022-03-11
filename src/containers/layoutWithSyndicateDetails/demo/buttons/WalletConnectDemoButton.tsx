import React from "react";
import { useDemoMode } from "@/hooks/useDemoMode";

interface IWalletConnectDemoButton {
  buttonText: string;
  alignment?: string;
  buttonType?: DemoButtonType;
  extraClasses?: string;
}

export enum DemoButtonType {
  RECTANGLE = "RECTANGLE",
  ROUND = "ROUND"
}

const WalletConnectDemoButton: React.FC<IWalletConnectDemoButton> = ({
  buttonText,
  alignment = "justify-center",
  buttonType = DemoButtonType.RECTANGLE,
  extraClasses = ""
}) => {
  const isDemoMode = useDemoMode();

  if (isDemoMode) return null;

  if (buttonType === DemoButtonType.RECTANGLE) {
    return (
      <a href="/clubs/demo/manage" className={extraClasses}>
        <span
          className={`text-green-volt bg-green-volt bg-opacity-10 p-4 rounded-custom flex items-center w-full cursor-pointer ${alignment}`}
        >
          <span className="mr-2">{buttonText}</span>
          <img src="/images/status/gamecontroller.svg" alt="demo icon" />
        </span>
      </a>
    );
  }
  else {
    return (
      <a href="/clubs/demo/manage" className={extraClasses}>
        <span
          className={`text-green-volt bg-gray-syn8 hover:bg-gray-syn6 py-4 px-6 rounded-full flex items-center w-full cursor-pointer ${alignment}`}
        >
          <div className="flex space-x-2">
            <img src="/images/status/gamecontroller.svg" alt="demo icon" />
            <span className="mr-2">{buttonText}</span>
          </div>
          <img src="/images/arrowNext.svg" alt="Right arrow" />
        </span>
      </a>
    );
  }

};

export default WalletConnectDemoButton;
