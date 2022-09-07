import { FC } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  CopiedLinkIcon,
  CopyLinkIcon,
  LockIcon
} from 'src/components/iconWrappers';
import TokenGateBanner from '@/containers/managerActions/clubTokenMembers/tokenGateBanner';
import useClubMixinGuardFeatureFlag from '@/hooks/clubs/useClubsMixinGuardFeatureFlag';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';

interface Props {
  link: string;
  updateCopyState: () => void;
  showCopiedState: boolean;
  creatingSyndicate?: boolean;
  syndicateSuccessfullyCreated?: boolean;
  showConfettiSuccess?: boolean;
  borderColor?: string;
  accentColor?: string;
  copyButtonText?: string;
  hoverEffect?: boolean;
  customZIndex?: string;
  backgroundColor?: string;
  borderRadius?: string;
  copyBorderRadius?: string;
}
const CopyLink: FC<Props> = ({
  link,
  updateCopyState,
  showCopiedState,
  creatingSyndicate = false,
  syndicateSuccessfullyCreated = false,
  showConfettiSuccess = false,
  borderColor = 'border-gray-syn6',
  accentColor = 'green',
  copyButtonText = 'Copy',
  hoverEffect = true,
  customZIndex = '',
  backgroundColor = 'bg-gray-syn8',
  borderRadius = 'rounded',
  copyBorderRadius = 'rounded'
}) => {
  const {
    erc20TokenSliceReducer: { activeModuleDetails }
  } = useSelector((state: AppState) => state);

  const { isReady, isClubMixinGuardTreatmentOn } =
    useClubMixinGuardFeatureFlag();

  const isTokenGated = activeModuleDetails?.activeMintModuleReqs?.isTokenGated;

  // show greyed out content when syndicate is being created.
  const creatingSyndicateContent = (
    <div
      className={`w-full border-1 border-gray-syn6 ${backgroundColor} rounded pl-4 py-2 pr-2 flex`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-grow-1 -mr-2">
          <LockIcon color="text-gray-syn7" />
        </div>

        <div className="overflow-hidden bg-gray-syn7 rounded-lg h-4.5 sm:w-60 w-1/2"></div>
        <div
          className={`flex-grow-1 px-3 bg-gray-syn6 h-10 flex justify-center items-center rounded`}
        >
          <CopyLinkIcon color="text-gray-syn4" />
          <span className="ml-3 font-whyte-medium text-gray-syn4 sm:text-base text-sm">
            Copy
          </span>
        </div>
      </div>
    </div>
  );

  // token-gated banner
  const showTokenGatedBanner =
    isTokenGated && isReady && isClubMixinGuardTreatmentOn;

  // content to display after completion of the syndicate creation process.
  const defaultContent = (
    <div className="flex flex-col w-full">
      <div
        className={`w-full border-1 relative ${
          customZIndex ?? ''
        } ${borderColor} ${backgroundColor} ${
          hoverEffect ? 'hover:bg-gray-syn7' : ''
        } transition-all duration-300 ${borderRadius} flex ${
          syndicateSuccessfullyCreated && showConfettiSuccess
            ? 'p-4'
            : 'pl-4 py-2 pr-2'
        }`}
      >
        <CopyToClipboard text={link}>
          <button
            className="overflow-hidden flex items-center w-full"
            onClick={updateCopyState}
          >
            <div className="flex-grow-1 mr-2">
              <LockIcon color={`text-${accentColor}`} />
            </div>

            <span
              className={`line-clamp-1 w-full overflow-hidden flex-grow-1 text-left text-sm ${
                syndicateSuccessfullyCreated && showConfettiSuccess
                  ? `text-${accentColor}`
                  : `text-transparent bg-clip-text bg-gradient-to-r from-${accentColor}`
              }`}
            >
              {link}
            </span>
            {!(syndicateSuccessfullyCreated && showConfettiSuccess) && (
              <div
                className={`flex-grow-1 px-3 ${
                  showCopiedState ? 'border-transparent' : `bg-${accentColor}`
                } text-black flex h-10 justify-center items-center ${copyBorderRadius} hover:opacity-80`}
              >
                {showCopiedState ? (
                  <CopiedLinkIcon color={`text-${accentColor}`} />
                ) : (
                  <CopyLinkIcon />
                )}
                <span
                  className={`ml-3 font-whyte-medium sm:text-base text-sm whitespace-nowrap ${
                    showCopiedState && `text-${accentColor}`
                  }`}
                >
                  {showCopiedState ? 'Copied' : copyButtonText}
                </span>
              </div>
            )}
          </button>
        </CopyToClipboard>
      </div>
      {showTokenGatedBanner && <TokenGateBanner />}
    </div>
  );

  return creatingSyndicate ? creatingSyndicateContent : defaultContent;
};

export default CopyLink;
