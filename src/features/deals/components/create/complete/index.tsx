import { AddressLayout } from '@/components/shared/ensAddress';
import { DisplayAddressWithENS } from '@/components/shared/ensAddress/display';
import { B2, H1, H2 } from '@/components/typography';

interface Props {
  dealName: string;
  dealDetails: string;
  ensName?: string;
  destinationAddress: string;
  commitmentGoalAmount: string;
  commitmentGoalTokenSymbol: string;
  commitmentGoalTokenLogo: string;
  dealURL?: string;
}

// Coin icons (one-offs)
const leftTopCoin = (
  <svg
    width="44"
    height="35"
    viewBox="0 0 44 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38.5799 5.98783C38.8907 6.57487 38.8559 7.42845 38.3368 8.57465C37.8227 9.70983 36.874 11.0341 35.5411 12.4628C32.8795 15.3157 28.7666 18.4994 23.831 21.3212C18.8953 24.1431 14.106 26.0489 10.3623 26.858C8.48747 27.2632 6.90333 27.387 5.70542 27.2306C4.49589 27.0727 3.78347 26.6463 3.47269 26.0593C3.1619 25.4723 3.19669 24.6187 3.71581 23.4725C4.22994 22.3373 5.17857 21.0131 6.51152 19.5843C9.17315 16.7314 13.286 13.5477 18.2216 10.7259C23.1573 7.90407 27.9467 5.99824 31.6903 5.18914C33.5651 4.78394 35.1493 4.66013 36.3472 4.81651C37.5567 4.97441 38.2691 5.4008 38.5799 5.98783Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <path
      d="M40.0267 8.72147C40.3375 9.30851 40.3027 10.1621 39.7836 11.3083C39.2695 12.4435 38.3208 13.7677 36.9879 15.1964C34.3262 18.0494 30.2134 21.2331 25.2778 24.0549C20.3421 26.8767 15.5527 28.7825 11.8091 29.5916C9.93425 29.9968 8.3501 30.1206 7.1522 29.9643C5.94267 29.8064 5.23025 29.38 4.91946 28.7929C4.60868 28.2059 4.64346 27.3523 5.16259 26.2061C5.67672 25.0709 6.62535 23.7467 7.9583 22.318C10.6199 19.465 14.7328 16.2813 19.6684 13.4595C24.6041 10.6377 29.3934 8.73188 33.1371 7.92278C35.0119 7.51759 36.5961 7.39378 37.794 7.55015C39.0035 7.70805 39.7159 8.13444 40.0267 8.72147Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <line
      y1="-0.5"
      x2="3.71103"
      y2="-0.5"
      transform="matrix(0.46789 0.883787 -0.868135 0.496329 2.89404 26.0344)"
      stroke="#BEC8CF"
    />
    <line
      x1="38.7407"
      y1="6.34399"
      x2="40.0366"
      y2="8.85806"
      stroke="#BEC8CF"
    />
  </svg>
);
const leftMiddleCoin = (
  <svg
    width="38"
    height="45"
    viewBox="0 0 38 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.7213 2.72917C18.3244 2.35903 21.9399 4.18557 24.875 7.56112C27.8075 10.9337 30.0163 15.8109 30.7739 21.3957C31.5315 26.9806 30.6885 32.1713 28.739 36.0454C26.7878 39.9229 23.7604 42.4319 20.1574 42.802C16.5543 43.1721 12.9387 41.3456 10.0036 37.97C7.07112 34.5974 4.86233 29.7203 4.10471 24.1354C3.34709 18.5505 4.19014 13.3599 6.13961 9.48577C8.09079 5.60826 11.1182 3.09931 14.7213 2.72917Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <path
      d="M17.6964 2.01958C21.2995 1.64944 24.915 3.47598 27.8501 6.85153C30.7826 10.2241 32.9914 15.1013 33.749 20.6862C34.5066 26.271 33.6636 31.4617 31.7141 35.3358C29.7629 39.2133 26.7355 41.7223 23.1324 42.0924C19.5294 42.4625 15.9138 40.636 12.9787 37.2604C10.0462 33.8878 7.83743 29.0107 7.07981 23.4258C6.32219 17.8409 7.16524 12.6503 9.11471 8.77617C11.0659 4.89867 14.0933 2.38971 17.6964 2.01958Z"
      fill="black"
      stroke="#BEC8CF"
    />
  </svg>
);
const leftBottomCoin = (
  <svg
    width="26"
    height="45"
    viewBox="0 0 26 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.34958 42.3451C8.71014 42.1653 8.11597 41.5515 7.64389 40.3852C7.17635 39.23 6.87153 37.6298 6.75604 35.6793C6.52543 31.7844 7.05601 26.6104 8.4161 21.0901C9.7762 15.5698 11.6988 10.7872 13.6944 7.51809C14.6939 5.88092 15.6966 4.64832 16.636 3.88864C17.5844 3.1216 18.3845 2.89971 19.0239 3.07946C19.6633 3.25921 20.2575 3.87303 20.7296 5.03939C21.1971 6.19454 21.502 7.79471 21.6175 9.74529C21.8481 13.6402 21.3175 18.8142 19.9574 24.3344C18.5973 29.8547 16.6747 34.6374 14.6791 37.9065C13.6796 39.5436 12.6769 40.7762 11.7375 41.5359C10.7891 42.3029 9.98902 42.5248 9.34958 42.3451Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <path
      d="M6.37204 41.5077C5.7326 41.3279 5.13843 40.7141 4.66635 39.5478C4.19881 38.3926 3.89399 36.7924 3.7785 34.8419C3.54789 30.947 4.07847 25.773 5.43856 20.2527C6.79866 14.7324 8.72121 9.94976 10.7169 6.68068C11.7163 5.04352 12.7191 3.81092 13.6584 3.05124C14.6069 2.2842 15.4069 2.0623 16.0464 2.24205C16.6858 2.4218 17.28 3.03563 17.7521 4.20199C18.2196 5.35714 18.5244 6.95731 18.6399 8.90789C18.8705 12.8028 18.3399 17.9768 16.9798 23.497C15.6198 29.0173 13.6972 33.8 11.7015 37.0691C10.7021 38.7062 9.69932 39.9388 8.76 40.6985C7.81156 41.4655 7.01148 41.6874 6.37204 41.5077Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <line
      y1="-0.5"
      x2="3.71103"
      y2="-0.5"
      transform="matrix(-0.962687 -0.270616 0.239227 -0.970963 19.4409 2.67737)"
      stroke="#BEC8CF"
    />
    <line
      x1="8.98072"
      y1="42.2157"
      x2="6.26638"
      y2="41.4205"
      stroke="#BEC8CF"
    />
  </svg>
);
const rightTopCoin = (
  <svg
    width="47"
    height="39"
    viewBox="0 0 47 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.30049 25.0566C3.67623 21.4888 5.24226 17.753 8.40158 14.5864C11.5581 11.4225 16.2667 8.87399 21.7839 7.72295C27.3012 6.5719 32.5385 7.04541 36.5409 8.71575C40.5468 10.3876 43.2637 13.2298 43.888 16.7976C44.5122 20.3655 42.9462 24.1012 39.7869 27.2679C36.6303 30.4318 31.9218 32.9803 26.4045 34.1313C20.8873 35.2824 15.65 34.8089 11.6476 33.1385C7.6417 31.4667 4.92474 28.6245 4.30049 25.0566Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <path
      d="M3.38203 22.139C2.75777 18.5712 4.3238 14.8354 7.48312 11.6688C10.6397 8.50488 15.3482 5.95639 20.8655 4.80534C26.3827 3.6543 31.62 4.1278 35.6224 5.79815C39.6283 7.46996 42.3453 10.3122 42.9695 13.88C43.5938 17.4479 42.0278 21.1836 38.8684 24.3503C35.7119 27.5142 31.0033 30.0627 25.4861 31.2137C19.9688 32.3648 14.7315 31.8913 10.7291 30.2209C6.72324 28.5491 4.00629 25.7069 3.38203 22.139Z"
      fill="black"
      stroke="#BEC8CF"
    />
  </svg>
);
const rightMiddleCoin = (
  <svg
    width="37"
    height="44"
    viewBox="0 0 37 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.78861 6.44478C6.35217 6.09322 7.20608 6.0675 8.38614 6.50418C9.55487 6.93667 10.9429 7.78918 12.4624 9.01766C15.4966 11.4707 18.9635 15.3478 22.1276 20.0713C25.2917 24.7949 27.5317 29.4373 28.6038 33.1143C29.1407 34.9558 29.3763 36.5272 29.3052 37.7331C29.2333 38.9508 28.8584 39.6916 28.2948 40.0432C27.7313 40.3947 26.8773 40.4205 25.6973 39.9838C24.5286 39.5513 23.1405 38.6988 21.621 37.4703C18.5868 35.0173 15.1199 31.1401 11.9558 26.4166C8.79175 21.6931 6.55168 17.0506 5.47961 13.3737C4.94272 11.5322 4.70708 9.9608 4.77827 8.75483C4.85015 7.53715 5.22505 6.79634 5.78861 6.44478Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <path
      d="M8.41312 4.80818C8.97668 4.45662 9.83059 4.4309 11.0107 4.86759C12.1794 5.30008 13.5674 6.15259 15.087 7.38106C18.1211 9.83406 21.588 13.7112 24.7521 18.4347C27.9162 23.1583 30.1563 27.8007 31.2283 31.4777C31.7652 33.3192 32.0009 34.8906 31.9297 36.0965C31.8578 37.3142 31.4829 38.055 30.9193 38.4066C30.3558 38.7581 29.5019 38.7839 28.3218 38.3472C27.1531 37.9147 25.765 37.0622 24.2455 35.8337C21.2113 33.3807 17.7445 29.5035 14.5804 24.78C11.4163 20.0565 9.17619 15.414 8.10412 11.7371C7.56723 9.89561 7.33159 8.3242 7.40278 7.11823C7.47467 5.90056 7.84956 5.15974 8.41312 4.80818Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <line
      y1="-0.5"
      x2="3.71103"
      y2="-0.5"
      transform="matrix(0.84845 -0.529276 0.556535 0.830824 28.311 40.6224)"
      stroke="#BEC8CF"
    />
    <line
      x1="6.13248"
      y1="6.25942"
      x2="8.54851"
      y2="4.78877"
      stroke="#BEC8CF"
    />
  </svg>
);
const rightBottomCoin = (
  <svg
    width="51"
    height="53"
    viewBox="0 0 51 53"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38.9106 41.4056C35.9871 43.5439 31.944 43.7924 27.7064 42.3601C23.4724 40.9291 19.1037 37.834 15.6304 33.3954C12.1571 28.9568 10.2646 24.0505 9.99179 19.7221C9.71872 15.39 11.0655 11.6959 13.989 9.55754C16.9125 7.41916 20.9556 7.17075 25.1932 8.60299C29.4272 10.034 33.7959 13.1291 37.2692 17.5677C40.7424 22.0063 42.635 26.9126 42.9078 31.241C43.1809 35.5731 41.834 39.2672 38.9106 41.4056Z"
      fill="black"
      stroke="#BEC8CF"
    />
    <path
      d="M36.7006 43.5201C33.7772 45.6584 29.7341 45.9069 25.4964 44.4746C21.2624 43.0436 16.8937 39.9485 13.4205 35.5099C9.94718 31.0713 8.05466 26.165 7.78183 21.8366C7.50876 17.5045 8.85558 13.8104 11.779 11.672C14.7025 9.53366 18.7456 9.28525 22.9833 10.7175C27.2172 12.1485 31.5859 15.2436 35.0592 19.6822C38.5325 24.1208 40.425 29.0271 40.6978 33.3555C40.9709 37.6876 39.6241 41.3817 36.7006 43.5201Z"
      fill="black"
      stroke="#BEC8CF"
    />
  </svg>
);

export const DealsCreateComplete: React.FC<Props> = ({
  dealName,
  dealDetails,
  ensName,
  destinationAddress,
  commitmentGoalAmount,
  commitmentGoalTokenSymbol,
  commitmentGoalTokenLogo,
  dealURL
}) => {
  const coinSideWidth = '290px';
  const dealCardPaddingTailwindUnit = 8;
  return (
    <div className="relative">
      {/* Deal card */}
      <a
        href={dealURL}
        className={`block relative p-${dealCardPaddingTailwindUnit} bg-black border border-gray-syn6 rounded-custom mx-auto`}
        style={{
          width: `calc(100% - ${coinSideWidth})`
        }}
      >
        {/* Flying coins */}
        <div className="absolute h-full w-full animate-fade_in_double">
          <div
            className={`absolute -left-${dealCardPaddingTailwindUnit} -top-${dealCardPaddingTailwindUnit} transform -translate-x-full h-full`}
            style={{
              width: `calc(${coinSideWidth} / 2)`
            }}
          >
            <div className="vertically-center space-y-4 flex flex-col items-center">
              <div className="relative -left-4">
                <div className="relative animate-deal-coin-top-left">
                  {leftTopCoin}
                </div>
              </div>
              <div className="relative left-4">
                <div className="relative animate-deal-coin-middle-left">
                  {leftMiddleCoin}
                </div>
              </div>
              <div className="relative -left-4">
                <div className="relative animate-deal-coin-bottom-left">
                  {leftBottomCoin}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`absolute right-${dealCardPaddingTailwindUnit} -top-${dealCardPaddingTailwindUnit} transform translate-x-full h-full`}
            style={{
              width: `calc(${coinSideWidth} / 2)`
            }}
          >
            <div className="vertically-center space-y-4 flex flex-col items-center">
              <div className="relative left-4">
                <div className="relative animate-deal-coin-top-right">
                  {rightTopCoin}
                </div>
              </div>
              <div className="relative -left-4">
                <div className="relative animate-deal-coin-middle-right">
                  {rightMiddleCoin}
                </div>
              </div>
              <div className="relative left-4">
                <div className="relative animate-deal-coin-bottom-right">
                  {rightBottomCoin}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chain icon */}
        <img
          src="/images/link-chain-gray.svg"
          alt="Link icon"
          className={`absolute right-4 top-4 w-4 h-4 ${
            dealURL ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Title */}
        <H1 extraClasses="mb-3">{dealName} Deal</H1>

        {/* Details */}
        <B2>{dealDetails}</B2>

        {/* Destination & goal */}
        <div className="md:flex md:space-x-14 space-y-4 md:space-y-0 mt-4">
          <div>
            <B2 extraClasses="text-gray-syn4 mb-1">Destination</B2>
            <DisplayAddressWithENS
              name={ensName}
              address={destinationAddress}
              layout={AddressLayout.ONE_LINE}
              extraClasses="px-4 py-2.5 rounded-full border border-gray-syn7"
            />
          </div>
          <div>
            <B2 extraClasses="text-gray-syn4 mb-1">Goal</B2>
            <div className="flex items-center space-x-1">
              <img
                src={commitmentGoalTokenLogo}
                alt="Token logo"
                className="w-6 h-6"
              />
              <H2>{commitmentGoalAmount}</H2>
              <B2 extraClasses="text-gray-syn4">{commitmentGoalTokenSymbol}</B2>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};
