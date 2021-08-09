import React from "react";

export const NonEditableSetting = (): JSX.Element => {
  return (
    <p className="flex text-sm text-gray-49">
      <img
        src="/images/tokenWarning.svg"
        alt="token warning"
        className="mr-2"
      />
      This setting can’t be changed once the syndicate is created
    </p>
  );
};
