import React from 'react';
import { HideIcon, UnHideIcon } from '@/components/icons/hideUnhide/index';

const HideAssetPill: React.FC<{
  currentlyHidden?: boolean;
  hide?: boolean;
  backgroundColor?: string;
  onClick?: (e: any) => void;
  iconOnly?: boolean;
}> = ({
  currentlyHidden = false,
  hide,
  backgroundColor = 'bg-gray-syn7',
  onClick,
  iconOnly = false
}) => {
  return (
    <button
      className={`flex justify-center items-center ${
        currentlyHidden
          ? `rounded-full px-2 ${backgroundColor} cursor-not-allowed`
          : ''
      } space-x-2 ${
        iconOnly ? `bg-white bg-opacity-30 rounded-full w-8 h-8` : ''
      }
      `}
      onClick={(e) => (onClick ? onClick(e) : null)}
    >
      {/* icon  */}
      {hide || currentlyHidden ? (
        <HideIcon fillColor={iconOnly ? '#FFFFFF' : '#90949E'} />
      ) : (
        <UnHideIcon fillColor={iconOnly ? '#FFFFFF' : '#90949E'} />
      )}

      {/* text  */}
      {!iconOnly ? (
        <div
          className={`text-gray-syn4 capitalize ${
            currentlyHidden ? 'text-sm' : 'text-base'
          }`}
        >
          {currentlyHidden && !hide ? 'hidden' : hide ? 'hide' : 'unhide'}
        </div>
      ) : null}
    </button>
  );
};

export default HideAssetPill;
