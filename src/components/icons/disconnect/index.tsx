import React from 'react';

interface IIconDisconnect {
  height?: number;
  width?: number;
  fill?: string;
  textColorClass?: string;
  hoverTextColorClass?: string;
  extraClasses?: string;
}

const IconDisconnect: React.FC<IIconDisconnect> = ({
  height = 16,
  width = 16,
  textColorClass = 'text-gray-syn4',
  hoverTextColorClass = 'text-gray-syn3',
  extraClasses = '',
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${textColorClass} hover:${hoverTextColorClass} ${extraClasses}`}
      {...rest}
    >
      <g clipPath="url(#clip0_1028_74807)">
        <path d="M12.1329 2.10211C12.3863 1.74018 12.8883 1.64934 13.2231 1.93763C14.2934 2.85914 15.1044 4.05112 15.5673 5.39546C16.1173 6.99285 16.1476 8.72336 15.6536 10.339C15.1597 11.9546 14.1669 13.3724 12.8177 14.3891C11.4684 15.4058 9.83196 15.9693 8.14279 15.9988C6.45361 16.0283 4.79846 15.5222 3.41456 14.5532C2.03065 13.5842 0.989046 12.2019 0.439022 10.6045C-0.111002 9.00714 -0.141206 7.27663 0.352739 5.66102C0.768436 4.30134 1.53741 3.08179 2.57485 2.12348C2.89941 1.82369 3.40422 1.89696 3.67011 2.24982V2.24982C3.93601 2.60268 3.8613 3.101 3.54435 3.40882C2.77307 4.15785 2.19967 5.09245 1.88283 6.12881C1.48767 7.4213 1.51183 8.80572 1.95185 10.0836C2.39187 11.3615 3.22516 12.4674 4.33228 13.2426C5.4394 14.0178 6.76352 14.4226 8.11486 14.399C9.46621 14.3754 10.7754 13.9247 11.8548 13.1113C12.9342 12.2979 13.7284 11.1637 14.1235 9.87118C14.5187 8.57869 14.4945 7.19428 14.0545 5.91637C13.7017 4.89169 13.096 3.97767 12.2991 3.25601C11.9716 2.95944 11.8795 2.46403 12.1329 2.10211V2.10211Z" />
        <rect x="7.146" width="1.71429" height="6.85714" rx="0.857143" />
      </g>
      <defs>
        <clipPath id="clip0_1028_74807">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0.00317383)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconDisconnect;
