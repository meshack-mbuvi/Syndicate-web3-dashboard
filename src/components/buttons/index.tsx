import Link from "next/link";
import React, { useState } from "react";

/**
 * Primary button has a green background and white text
 * @param {*} props
 */
export const PrimaryButton = (props: {
  children: any;
  disabled?: boolean;
  customClasses: string;
  onClick?: () => void;
  type?;
  approved?: boolean;
  createSyndicate?: boolean;
  textColor?: string;
  icon?: string;
}) => {
  const {
    children,
    customClasses = "bg-light-green",
    approved = false,
    createSyndicate = false,
    textColor = "text-white",
    icon,
    ...rest
  } = props;

  return (
    <button
      className={`flex items-center justify-center border text-base font-light rounded-lg focus:outline-none focus:ring ${textColor} ${customClasses}`}
      {...rest}
    >
      {approved ? (
        <img
          className="inline w-4 mr-2"
          src="/images/checkmark-approved.svg"
          alt="Approved"
        />
      ) : null}
      {createSyndicate ? (
        <img
          className="inline w-4 mr-4"
          src={`/images/${
            textColor === "text-white" ? "plus-circle-white" : "plus-circle"
          }.svg`}
          alt=""
        />
      ) : null}
      {icon ? <img className="inline w-4 mr-4" src={icon} alt="" /> : null}
      {children}
    </button>
  );
};

export default PrimaryButton;

export enum SocialLinkSource {
  TWITTER = "twitter",
  DISCORD = "discord",
  TELEGRAM = "telegram",
  WEB = "web", // a general link
}

export const SocialLinkButton = (props: {
  customClasses?: string;
  url: string;
  source?: SocialLinkSource;
  onClick?: () => void;
}) => {
  const {
    customClasses = "",
    url,
    source = SocialLinkSource.WEB,
    ...rest
  } = props;

  const hoverColor =
    source === SocialLinkSource.TWITTER
      ? "hover:bg-twitter-blue hover:bg-opacity-100"
      : source === SocialLinkSource.DISCORD
      ? "hover:bg-discord-purple hover:bg-opacity-100"
      : source === SocialLinkSource.TELEGRAM
      ? "hover:bg-telegram-blue hover:bg-opacity-100"
      : source === SocialLinkSource.WEB
      ? "hover:bg-white hover:bg-opacity-50"
      : "";

  return (
    <Link href={url}>
      <a
        className={`${customClasses} ${hoverColor} h-10 w-10 p-2 inline-flex items-center rounded-full transition duration-500 ease-out text-white bg-white bg-opacity-10`}
        target="_blank"
        {...rest}
      >
        <img className="mx-auto" src={`/images/social/${source}.svg`} />
      </a>
    </Link>
  );
};

export enum SocialAction {
  FOLLOW = "follow",
  MESSAGE = "message",
  PITCH = "pitch",
}

export const SocialActionButton = (props: {
  customClasses?: string;
  url?: string;
  action?: SocialAction;
  onClick?: () => void;
}) => {
  const { customClasses = "", url, action, onClick } = props;

  var isLabelVisibleOnMobile: boolean;
  var styles = customClasses;
  var label: string;
  var icon: string;

  // Set the styles, label, and icon depending on the intended action
  switch (action) {
    case SocialAction.FOLLOW:
      styles += " " + "bg-blue-neon active:bg-opacity-10";
      label = "Follow";
      isLabelVisibleOnMobile = true;
      icon = "/images/social/follow.svg";
      break;
    case SocialAction.MESSAGE:
      styles +=
        " " + "bg-white bg-opacity-10 hover:bg-opacity-30 active:bg-opacity-10";
      label = "Message";
      icon = "/images/social/message.svg";
      break;
    case SocialAction.PITCH:
      styles +=
        " " + "bg-white bg-opacity-10 hover:bg-opacity-30 active:bg-opacity-10";
      label = "Pitch";
      icon = "/images/social/document.svg";
      break;
  }

  return (
    <SocialButton
      label={label}
      icon={icon}
      url={url}
      onClick={onClick}
      isLabelVisibleOnMobile={isLabelVisibleOnMobile}
      customClasses={styles}
    />
  );
};

export const SocialButton = (props: {
  label: string;
  icon: string;
  url?: string;
  customClasses?: string;
  isLabelVisibleOnMobile?: boolean;
  onClick?: () => void;
}) => {
  const {
    label,
    icon,
    url,
    customClasses = "",
    isLabelVisibleOnMobile = true,
    onClick,
  } = props;

  var styles =
    customClasses +
    " " +
    "py-social-action-button-small sm:py-social-action-button-large overflow-visible focus:outline-none min-h-9 sm:w-auto inline-flex justify-center items-center px-5 sm:px-8 mr-2 sm:mr-3 mb-2 transition duration-500 ease-out text-sm font-medium rounded-md text-white active:transition-none";
  const img = (
    <img
      className={`${isLabelVisibleOnMobile ? "mr-1" : "sm:mr-2"} sm:mr-2`}
      src={icon}
    />
  );
  const text = (
    <p
      className={`${
        isLabelVisibleOnMobile ? "" : "hidden sm:block"
      } font-medium`}
    >
      {label}
    </p>
  );

  if (url) {
    return (
      <Link href={url}>
        <a className={styles}>
          {img} {text}
        </a>
      </Link>
    );
  } else {
    return (
      <button className={styles} onClick={onClick}>
        {img} {text}
      </button>
    );
  }
};
