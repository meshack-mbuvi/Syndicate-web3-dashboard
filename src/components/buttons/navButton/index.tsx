import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

export enum NavButtonType {
  CLOSE = 'CLOSE',
  UP = 'UP',
  DOWN = 'DOWN',
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
  BACK = 'BACK'
}

interface Props {
  type?: NavButtonType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handlePrevious?: (index?: number) => void;
  handleNext?: (index?: number) => void;
  currentStep?: number;
  disabled?: boolean;
  extraClasses?: string;
}

export const NavButton: React.FC<Props> = ({
  type,
  onClick,
  handleNext,
  handlePrevious,
  currentStep,
  disabled,
  extraClasses
}) => {
  return (
    <div
      className={`flex ${
        type === NavButtonType.HORIZONTAL
          ? 'w-24 space-x-5 align-middle py-auto'
          : 'flex-col md:w-12.5 w-10 space-y-5'
      } items-center justify-center rounded-full bg-gray-syn7 transition-all ${
        type === NavButtonType.VERTICAL ? 'h-23' : 'md:h-12.5 h-10'
      } ${extraClasses || ''}`}
    >
      {type === NavButtonType.CLOSE && (
        <button
          className="p-4.5 -m-2 text-gray-syn4 hover:text-white ease-out transition-all rounded-full"
          onClick={onClick}
        >
          <svg
            className="fill-current w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.261088 14.4651C-0.0819663 14.8081 -0.0920561 15.3933 0.261088 15.7364C0.614233 16.0794 1.19944 16.0794 1.5425 15.7364L8 9.27889L14.4575 15.7364C14.8006 16.0794 15.3959 16.0895 15.7389 15.7364C16.082 15.3832 16.082 14.8081 15.7389 14.4651L9.28141 7.99748L15.7389 1.53998C16.082 1.19692 16.0921 0.61171 15.7389 0.268655C15.3858 -0.0844891 14.8006 -0.0844891 14.4575 0.268655L8 6.72616L1.5425 0.268655C1.19944 -0.0844891 0.604143 -0.094579 0.261088 0.268655C-0.0819663 0.6218 -0.0819663 1.19692 0.261088 1.53998L6.71859 7.99748L0.261088 14.4651Z" />
          </svg>
        </button>
      )}
      {type === NavButtonType.BACK && (
        <button
          className="p-4.5 -m-2 text-gray-syn4 hover:text-white ease-out transition-all rounded-full"
          onClick={onClick}
        >
          <svg
            className="fill-current w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 8C0 8.21438 0.0947765 8.41161 0.267097 8.57454L5.98815 14.2599C6.16047 14.4228 6.34141 14.5 6.5482 14.5C6.97038 14.5 7.30641 14.1913 7.30641 13.7625C7.30641 13.5567 7.22886 13.3509 7.09101 13.2223L5.16101 11.2672L2.2574 8.63456L4.34249 8.76319H15.2418C15.6898 8.76319 16 8.44591 16 8C16 7.55409 15.6898 7.23681 15.2418 7.23681H4.34249L2.26602 7.36544L5.16101 4.73285L7.09101 2.7777C7.22886 2.6405 7.30641 2.44327 7.30641 2.23747C7.30641 1.80871 6.97038 1.5 6.5482 1.5C6.34141 1.5 6.16047 1.5686 5.97092 1.75726L0.267097 7.42546C0.0947765 7.58839 0 7.78562 0 8Z" />
          </svg>
        </button>
      )}
      {(type === NavButtonType.UP || type === NavButtonType.VERTICAL) && (
        <button
          className={clsx(
            'p-1 -m-2 relative text-gray-syn4 hover:text-white ease-out transition-all',
            type === NavButtonType.VERTICAL && 'top-1'
          )}
          onClick={
            type === NavButtonType.UP
              ? (e): void => onClick?.(e)
              : (): void => handlePrevious?.()
          }
          disabled={
            type === NavButtonType.UP &&
            currentStep !== undefined &&
            currentStep <= 1
          }
        >
          <svg
            className="fill-current w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.99568 6.25C9.77979 6.25 9.5639 6.32669 9.4171 6.47239L2.73316 12.5537C2.58636 12.684 2.5 12.8528 2.5 13.0445C2.5 13.4433 2.83679 13.75 3.28584 13.75C3.50173 13.75 3.70035 13.6733 3.84715 13.5506L9.99568 7.96779L16.1528 13.5506C16.291 13.6733 16.4896 13.75 16.7142 13.75C17.1632 13.75 17.5 13.4433 17.5 13.0445C17.5 12.8528 17.4136 12.684 17.2668 12.546L10.5829 6.47239C10.4188 6.32669 10.2202 6.25 9.99568 6.25Z" />
          </svg>
        </button>
      )}
      {(type === NavButtonType.DOWN || type === NavButtonType.VERTICAL) && (
        <button
          className={clsx(
            `p-1 -m-2 relative text-gray-syn4 ${
              disabled ? 'cursor-not-allowed' : 'hover:text-white'
            } ease-out transition-all`,
            type === NavButtonType.VERTICAL && 'top-1'
          )}
          onClick={() => handleNext?.()}
          disabled={disabled}
        >
          <svg
            className="fill-current w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.0043 13.75C10.2202 13.75 10.4361 13.6733 10.5829 13.5276L17.2668 7.44632C17.4136 7.31595 17.5 7.14724 17.5 6.95552C17.5 6.55675 17.1632 6.25 16.7142 6.25C16.4983 6.25 16.2997 6.32669 16.1529 6.44939L10.0043 12.0322L3.84715 6.44939C3.70898 6.32669 3.51036 6.25 3.28584 6.25C2.83679 6.25 2.5 6.55675 2.5 6.95552C2.5 7.14724 2.58636 7.31595 2.73316 7.45399L9.4171 13.5276C9.58117 13.6733 9.77979 13.75 10.0043 13.75Z" />
          </svg>
        </button>
      )}

      {/* Horizontal navigation buttons */}
      {type === NavButtonType.HORIZONTAL && (
        <button
          className={clsx(
            'flex py-auto text-gray-syn4 hover:text-white ease-out transition-all',
            !handlePrevious && 'cursor-not-allowed'
          )}
          onClick={(): void => handlePrevious?.()}
        >
          <Image
            src="/images/chevron-left-gray.svg"
            width={20}
            height={20}
            alt=""
          />
        </button>
      )}

      {type === NavButtonType.HORIZONTAL && (
        <button
          className={clsx(
            'flex py-auto text-gray-syn4 hover:text-white ease-out transition-all',
            (!handleNext || disabled) && 'cursor-not-allowed'
          )}
          onClick={() => handleNext?.()}
          disabled={disabled}
        >
          <Image
            src="/images/chevron-right-gray.svg"
            width={20}
            height={20}
            alt=""
          />
        </button>
      )}
    </div>
  );
};
