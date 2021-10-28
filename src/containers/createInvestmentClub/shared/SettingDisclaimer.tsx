import React from "react";
import Image from "next/image";

const SettingDisclaimer: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="mr-2 flex-none">
      <Image src="/images/lightbulb.svg" width={20} height={20} />
    </div>

    <div className="text-sm text-gray-lightManatee break-words">
      Changing this setting in the future will require a signed transaction with
      gas.
    </div>
  </div>
);

export default SettingDisclaimer;
