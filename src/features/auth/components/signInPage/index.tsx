// place all auth components here

import { WalletProviderList } from '@/components/connectWallet/providerButtons';
import IconDiscordLogo from '@/components/icons/logos/discordLogo';
import IconUserPrivacy from '@/components/icons/userPrivacy';
import { LinkButton } from '@/components/linkButtons';
import { SimpleTile, TileElevation } from '@/components/tile/simpleTile';
import { B3, B4, E2, H1, L1 } from '@/components/typography';
import TwoColumnLayout, {
  TwoColumnLayoutType
} from '@/containers/twoColumnLayout';
import { useTailwindScreenWidth } from '@/helpers/layout';
import useWindowSize from '@/hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';
import { DataStoragePrivacyModal } from '../privacyModal';

export {};

interface Props {
  handleDiscordClick: () => void;
}

export const AuthSignInPage: React.FC<Props> = ({ handleDiscordClick }) => {
  const [showPrivacyModal, setShowPrivacyyModal] = useState(false);
  const h1Ref = useRef<HTMLDivElement>(null);
  const windowWidth = useWindowSize().width;
  const [h1HeightPx, setH1HeightPx] = useState<number | undefined | null>(null);
  useEffect(() => {
    setH1HeightPx(h1Ref.current?.getBoundingClientRect().height);
  }, [windowWidth]);
  const paddingTop = `sm:pt-6`;
  const smTailwindBreakpointPx = useTailwindScreenWidth('sm').width;
  return (
    <>
      <DataStoragePrivacyModal
        show={showPrivacyModal}
        closeModal={() => {
          setShowPrivacyyModal(false);
        }}
      />
      <TwoColumnLayout
        managerSettingsOpen={false}
        dotIndicatorOptions={[]}
        hideWallet={true}
        hideEllipsis={false}
        keepLogoCentered={true}
        headerTitle={'Sign in'}
        hideFooter={true}
        gridGapClass="gap-y-8 sm:gap-8"
        type={TwoColumnLayoutType.EQUAL_COLUMNS}
        leftColumnComponent={
          <div className={`w-full md:w-11/12 ${paddingTop} relative `}>
            <H1
              style={{
                height:
                  windowWidth <= smTailwindBreakpointPx
                    ? 'auto'
                    : `${h1HeightPx}px`
              }}
            >
              <span className="relative sm:top-3">Sign in to Syndicate</span>
            </H1>
            {/* This ghost element provides a dynamic height to be used */}
            <H1
              forwardRef={h1Ref}
              extraClasses="opacity-0 hidden sm:block sm:absolute"
            >
              Sign in to Syndicate
            </H1>
            <B4 extraClasses="text-gray-syn4 mt-8">
              By signing in, you agree to Syndicate’s{' '}
              <a href="https://www.syndicate.io/terms">Terms</a>,{' '}
              <a href="https://www.syndicate.io/privacy">Privacy Policy</a>, and
              <a href="https://www.syndicate.io/community">
                Community Standards
              </a>
              .
            </B4>
            <div className="flex space-x-2 mt-6">
              <IconUserPrivacy
                width={20}
                height={20}
                textColorClass="text-gray-syn3"
              />
              <B3 extraClasses="text-gray-syn3">How is my data stored?</B3>
              <button
                onClick={() => {
                  setShowPrivacyyModal(true);
                }}
              >
                <B3>
                  <LinkButton showChevron={true}>Learn more</LinkButton>
                </B3>
              </button>
            </div>
          </div>
        }
        rightColumnComponent={
          <div className={`${paddingTop}`}>
            <div>
              <L1
                extraClasses="push-baseline-to-bottom"
                style={{
                  height:
                    windowWidth <= smTailwindBreakpointPx
                      ? 'auto'
                      : `${h1HeightPx}px`
                }}
              >
                Link a wallet
              </L1>
            </div>
            <div className="space-y-4 mt-8">
              <WalletProviderList elevation={TileElevation.SECONDARY} />
            </div>
            <div className="my-10 flex space-x-2 items-center">
              <div className="h-1px w-full bg-gray-syn6"></div>
              <E2>OR</E2>
              <div className="h-1px w-full bg-gray-syn6"></div>
            </div>
            <div className="flex space-x-2 items-center mb-4">
              <L1>Link a social account</L1>
              {/* <div className="rounded-full bg-green-volt text-black">New</div> */}
              <B3 extraClasses="bg-green-volt rounded-full px-2 py-0.5 text-black">
                New
              </B3>
            </div>
            <B3 extraClasses="text-gray-syn3 mb-6">
              Social accounts allow you to easily sign in to your Syndicate
              account. You’ll be able to connect a wallet later.
            </B3>
            <SimpleTile
              addOn={<IconDiscordLogo width={24} height={24} fill="#5865F2" />}
              onClick={handleDiscordClick}
            >
              Discord
            </SimpleTile>
          </div>
        }
      />
    </>
  );
};
