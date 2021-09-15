import React from "react";

interface INonEditableSetting {
  text?: string;
}

export const NonEditableSetting = (props: INonEditableSetting): JSX.Element => {
  const {
    text = "This setting can’t be changed once the syndicate is created",
  } = props;
  return (
    <p className="flex text-sm text-gray-3 pb-4">
      <img
        src="/images/tokenWarning.svg"
        alt="token warning"
        className="mr-2"
      />
      {text}
    </p>
  );
};
