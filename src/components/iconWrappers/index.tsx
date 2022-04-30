import { useDemoMode } from '@/hooks/useDemoMode';
import React from 'react';

/**
 * This icon wrapper contains an inverted exclamation mark sourced from the
 * figma designs on the syndicate form.
 * The wrapper renders an image with src attribute set to the custom svg icon
 * @param {object} props an object containing custom properties for styling
 */
export const InfoIcon = (props: {
  tooltip?: string | React.ReactNode;
  side?: string;
  iconSize?: string;
  src?: string;
}): JSX.Element => {
  const { tooltip, side, iconSize, src = '/images/info.svg' } = props;
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="tooltip pl-2">
        <img
          src={src}
          {...props}
          className={`image-tooltip ${iconSize ? iconSize : ``}`}
          alt=""
        />
        {tooltip ? (
          typeof tooltip === 'string' ? (
            <p
              className={`${
                side === 'left' ? 'left' : ''
              } text-sm font-light tooltiptext w-fit-content bg-gray-9 p-4 mt-1`}
            >
              {tooltip}
            </p>
          ) : (
            <div className="tooltiptext">{tooltip}</div>
          )
        ) : null}
      </div>
    </div>
  );
};

export enum ExternalLinkColor {
  GRAY = 'GRAY',
  GRAY4 = 'GRAY4',
  BLUE = 'BLUE',
  WHITE = 'WHITE'
}

/**Shows an icon for external links */
export const ExternalLinkIcon = (props) => {
  let icon;
  switch (props.iconColor) {
    case ExternalLinkColor.GRAY:
      icon = '/images/externalLinkGray.svg';
      break;

    case ExternalLinkColor.GRAY4:
      icon = '/images/externalLinkGray4.svg';
      break;

    case ExternalLinkColor.BLUE:
      icon = '/images/externalLink.svg';
      break;

    case ExternalLinkColor.WHITE:
      icon = '/images/externalLinkWhite.svg';
      break;

    default:
      icon = '/images/externalLink.svg';
      break;
  }
  return <img src={icon} {...props} alt="external-link" />;
};

export const CopyLinkIcon = (props: {
  color?: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  const { color = '#000', width = '16', height = '16' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
    >
      <path
        d="M7.90569 11.1011L8.90911 10.0848C7.91324 10.0095 7.26441 9.70841 6.77402 9.21908C5.45373 7.90167 5.46128 6.0347 6.76647 4.73234L9.22598 2.27819C10.5463 0.968301 12.4022 0.960773 13.7225 2.27819C15.0428 3.5956 15.0277 5.45504 13.7225 6.7574L12.2438 8.2329C12.455 8.7147 12.5003 9.27178 12.4248 9.7611L14.6429 7.55537C16.4461 5.74863 16.4612 3.19661 14.6354 1.36729C12.8021 -0.462035 10.2369 -0.446978 8.42626 1.35976L5.85359 3.93437C4.04291 5.74111 4.02782 8.30065 5.86113 10.1224C6.33644 10.5967 6.94 10.9355 7.90569 11.1011ZM8.09431 4.89796L7.09089 5.91425C8.08676 5.99706 8.73559 6.29066 9.22598 6.77998C10.5463 8.0974 10.5387 9.96436 9.23353 11.2667L6.76647 13.7209C5.45373 15.0308 3.59778 15.0383 2.2775 13.7284C0.95721 12.4035 0.964754 10.5516 2.2775 9.24166L3.75622 7.76616C3.54497 7.29189 3.49216 6.72728 3.57515 6.23796L1.35707 8.44369C-0.446067 10.2504 -0.461156 12.81 1.36461 14.6318C3.19793 16.4611 5.76306 16.446 7.56619 14.6468L10.1464 12.0647C11.9571 10.258 11.9722 7.69841 10.1389 5.87661C9.66356 5.40234 9.06 5.06358 8.09431 4.89796Z"
        className="fill-current"
      />
    </svg>
  );
};

export const CopyToClipboardIcon = (props: {
  color?: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  const { color = '#000', width = '16', height = '16' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.4095 7.4302C15.4697 7.58819 15.5005 7.75766 15.5 7.92873V14.6975C15.4997 15.0428 15.3735 15.374 15.1493 15.6181C14.925 15.8623 14.6209 15.9996 14.3037 16H8.69605C8.37897 15.9995 8.07499 15.8623 7.85078 15.6181C7.62656 15.3741 7.50041 15.0432 7.5 14.698V13.3777C7.5 13.2157 7.55915 13.0602 7.66443 12.9456C7.76972 12.831 7.91252 12.7666 8.06142 12.7666C8.21032 12.7666 8.35312 12.831 8.4584 12.9456C8.56369 13.0602 8.62284 13.2157 8.62284 13.3777V14.698L14.3044 14.7781L14.3718 8.48689H12.0887C11.9398 8.48689 11.797 8.4225 11.6917 8.30787C11.5865 8.19325 11.5273 8.03779 11.5273 7.87568V5.22242H11.1928C11.0439 5.22242 10.9011 5.15803 10.7958 5.0434C10.6905 4.92877 10.6314 4.77332 10.6314 4.61121C10.6314 4.44911 10.6905 4.29365 10.7958 4.17902C10.9011 4.0644 11.0439 4.00001 11.1928 4.00001H11.8572C12.0244 3.99945 12.19 4.03491 12.3445 4.10436C12.499 4.17381 12.6393 4.27585 12.7575 4.40463L15.1491 7.00837C15.2607 7.12881 15.3492 7.27219 15.4095 7.4302Z"
        className="fill-current"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.5 1.20651V10.7934C0.5 11.1134 0.626091 11.4203 0.850536 11.6466C1.07498 11.8729 1.37939 12 1.6968 12H8.30316C8.62058 12 8.92498 11.8729 9.14943 11.6466C9.37388 11.4203 9.5 11.1134 9.5 10.7934V3.90354C9.5 3.74508 9.46902 3.58816 9.40884 3.44176C9.34867 3.29536 9.26047 3.16234 9.14931 3.0503L6.47373 0.353266C6.24927 0.127045 5.94487 -2.7651e-05 5.62747 4.51291e-09H1.6968C1.37939 4.51291e-09 1.07498 0.127114 0.850536 0.353379C0.626091 0.579644 0.5 0.886525 0.5 1.20651ZM5.02919 3.90367V1.20651H1.6968V10.7934H8.30316V4.50693H5.62759C5.46889 4.50693 5.31668 4.44337 5.20445 4.33023C5.09223 4.21711 5.02919 4.06366 5.02919 3.90367Z"
        className="fill-current"
      />
    </svg>
  );
};

export const CopiedLinkIcon = ({
  color = 'text-green',
  width = '16',
  height = '16'
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
    >
      <path
        d="M5.3125 13.8125C5.72656 13.8125 6.04688 13.6406 6.27344 13.3047L13.6172 1.86719C13.7812 1.60938 13.8516 1.39062 13.8516 1.17969C13.8516 0.625 13.4609 0.242188 12.8984 0.242188C12.5156 0.242188 12.2812 0.382812 12.0469 0.75L5.27344 11.4922L1.79688 7.03125C1.5625 6.72656 1.32031 6.60156 0.976562 6.60156C0.414062 6.60156 0.0078125 7 0.0078125 7.54688C0.0078125 7.78906 0.09375 8.02344 0.296875 8.26562L4.34375 13.3125C4.61719 13.6562 4.90625 13.8125 5.3125 13.8125Z"
        className={`fill-current ${color}`}
      />
    </svg>
  );
};

export const LockIcon = ({
  color = 'text-green',
  width = '16',
  height = '16'
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
    >
      <path
        d="M2.08084 16H9.91916C10.9813 16 11.5 15.4751 11.5 14.327V8.30753C11.5 7.27422 11.0719 6.74116 10.1909 6.65095V4.58432C10.1909 1.49257 8.15719 0 6 0C3.84281 0 1.80913 1.49257 1.80913 4.58432V6.69195C1.00225 6.81497 0.5 7.33983 0.5 8.30753V14.327C0.5 15.4751 1.01871 16 2.08084 16ZM3.13473 4.4121C3.13473 2.35366 4.46033 1.26294 6 1.26294C7.53967 1.26294 8.86527 2.35366 8.86527 4.4121V6.64275L3.13473 6.65095V4.4121Z"
        className={`fill-current ${color}`}
      />
    </svg>
  );
};

export const OpenExternalLinkIcon = (props: {
  className?: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  const { className = 'text-black', width = '16', height = '16' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.2007 2.39868C7.64257 2.39868 8.00078 2.75689 8.00078 3.19876C8.00078 3.60907 7.69192 3.94724 7.29401 3.99346L7.2007 3.99884H2.40023C1.98993 3.99884 1.65176 4.3077 1.60554 4.70561L1.60016 4.79892V13.5998C1.60016 14.0101 1.90902 14.3483 2.30693 14.3945L2.40023 14.3999H11.2011C11.6114 14.3999 11.9496 14.091 11.9958 13.6931L12.0012 13.5998V8.79931C12.0012 8.35744 12.3594 7.99923 12.8012 7.99923C13.2116 7.99923 13.5497 8.30809 13.5959 8.706L13.6013 8.79931V13.5998C13.6013 14.878 12.6021 15.9229 11.3421 15.9959L11.2011 16H2.40023C1.12196 16 0.0770788 15.0008 0.00407455 13.7408L0 13.5998V4.79892C0 3.52065 0.999234 2.47576 2.2592 2.40276L2.40023 2.39868H7.2007Z"
        className="fill-current"
      />
      <path
        d="M15.203 0C15.6133 0 15.9515 0.308862 15.9977 0.706772L16.0031 0.800078V5.60055C16.0031 6.04242 15.6449 6.40062 15.203 6.40062C14.7927 6.40062 14.4545 6.09176 14.4083 5.69385L14.4029 5.60055V1.60016H10.4026C9.99225 1.60016 9.65408 1.29129 9.60786 0.893384L9.60248 0.800078C9.60248 0.389769 9.91134 0.0515993 10.3093 0.00538271L10.4026 0H15.203Z"
        className="fill-current"
      />
      <path
        d="M14.6373 0.234337C14.9498 -0.0781125 15.4563 -0.0781125 15.7688 0.234337C16.0572 0.522753 16.0794 0.976582 15.8353 1.29045L15.7688 1.36582L6.96793 10.1667C6.65548 10.4791 6.1489 10.4791 5.83645 10.1667C5.54803 9.87826 5.52585 9.42443 5.76989 9.11057L5.83645 9.0352L14.6373 0.234337Z"
        className="fill-current"
      />
    </svg>
  );
};

export const RightArrow = (props: {
  className?: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  const { className, width = '16', height = '14' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 7C16 6.78562 15.9052 6.58839 15.7329 6.42546L10.0118 0.740105C9.83953 0.577176 9.65859 0.499999 9.4518 0.499999C9.02962 0.499999 8.69359 0.808706 8.69359 1.23747C8.69359 1.44327 8.77114 1.64908 8.90899 1.7777L10.839 3.73285L13.7426 6.36544L11.6575 6.23681L0.758213 6.23681C0.310179 6.23681 9.53674e-07 6.55409 9.53674e-07 7C9.53674e-07 7.44591 0.310179 7.76319 0.758213 7.76319L11.6575 7.76319L13.734 7.63456L10.839 10.2672L8.90899 12.2223C8.77114 12.3595 8.69359 12.5567 8.69359 12.7625C8.69359 13.1913 9.02962 13.5 9.4518 13.5C9.65859 13.5 9.83953 13.4314 10.0291 13.2427L15.7329 7.57454C15.9052 7.41161 16 7.21438 16 7Z"
        className="fill-current"
      />
    </svg>
  );
};

export const WalletIcon = (props: {
  className?: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  const { className = 'text-green', width = '13', height = '10' } = props;

  const isDemoMode = useDemoMode();

  if (isDemoMode) {
    return (
      <img
        className="mr-2"
        width={18}
        height={12}
        src="/images/status/gamecontroller.svg"
        alt="demo icon"
      />
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.875 0H0.625C0.25 0 0 0.25 0 0.625V9.375C0 9.75 0.25 10 0.625 10H11.875C12.25 10 12.5 9.75 12.5 9.375V7.25H7.375C6.13236 7.25 5.125 6.24264 5.125 5C5.125 3.75736 6.13236 2.75 7.375 2.75H12.5V0.625C12.5 0.25 12.25 0 11.875 0Z"
        className="fill-current"
      />
      <circle cx="7.5" cy="5" r="1.25" className="fill-current animate-none" />
    </svg>
  );
};

export const RibbonIcon = (props: {
  className?: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  const { className, width = '16', height = '16' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.852 15.2887V10.0986C13.0146 9.04225 13.75 7.50704 13.75 5.80282C13.757 2.59155 11.1726 0 7.99999 0C4.82734 0 2.25 2.59155 2.25 5.80282C2.25 7.54225 3.0134 9.11268 4.22503 10.169V15.2887C4.22503 15.7817 4.51218 16 4.86936 16C5.14251 16 5.34561 15.8592 5.55572 15.6479L7.76887 13.4366C7.87393 13.331 7.95797 13.2958 8.04201 13.2958C8.11905 13.2958 8.2031 13.331 8.30815 13.4366L10.5213 15.6479C10.7384 15.8662 10.9485 16 11.2147 16C11.5719 16 11.852 15.7817 11.852 15.2887ZM8.007 10.2042C5.56973 10.1972 3.66474 8.23944 3.66474 5.80282C3.66474 3.35915 5.56973 1.40141 8.007 1.40141C10.4373 1.40141 12.3423 3.35915 12.3493 5.80282C12.3563 8.23944 10.4373 10.2042 8.007 10.2042Z"
        className="fill-current"
      />
    </svg>
  );
};
