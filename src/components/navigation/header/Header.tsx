import { NavButton, NavButtonType } from '@/components/buttons/navButton';
import {
  DotIndicators,
  DotIndicatorsOrientation
} from '@/components/dotIndicators';
import ProgressBar from '@/components/ProgressBar';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MoreMenu } from './moreMenu';
import { NavBarNavItem } from './navbarItems';
import NetworkComponent from './network';
import WalletComponent from './wallet';

interface props {
  navItems: { navItemText: string; url?: string; isLegal?: boolean }[];
  showBackButton?: boolean;
  showNav?: boolean;
  activeIndex?: number;
  dotIndicatorOptions?: string[];
  handleExitClick?: () => void;
  setActiveIndex?: (event) => void;
  hideWalletAndEllipsis?: boolean;
  showCloseButton?: boolean;
}

const Header: React.FC<props> = ({
  navItems,
  handleExitClick,
  setActiveIndex,
  showBackButton = false,
  showNav = true,
  activeIndex = 0,
  hideWalletAndEllipsis = false,
  showCloseButton = false,
  dotIndicatorOptions = []
}) => {
  const router = useRouter();
  const navRef = useRef(null);
  const [showMobileNav, setShowMobileNav] = React.useState(false);

  // For progress bar
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);
  const { currentStep, steps, preClubCreationStep } =
    useCreateInvestmentClubContext();
  const showCreateProgressBar = router.pathname === '/clubs/create';

  useEffect(() => {
    if (showMobileNav) {
      // ideally want to add this to the parent element however parent seems to have sibling elements
      // with overflow  -> adding to body for now
      document.body.classList.add('overflow-y-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-y-hidden');
    };
  }, [showMobileNav]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setShowMobileNav(false);
      }
    };

    if (showMobileNav) {
      // ideally want to add this to the parent element however parent seems to have sibling elements
      // with overflow  -> adding to body for now
      document.addEventListener('mouseup', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [navRef, showMobileNav]);

  useEffect(() => {
    const closeMobileNav = () => {
      setShowMobileNav(false);
    };

    router.events.on('routeChangeStart', closeMobileNav);
    return () => {
      router.events.off('routeChangeStart', closeMobileNav);
    };
  }, [router.events]);

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  const handleBackButton = () => {
    const path = router.pathname.split('/');
    //assumes showBackButton only used on ...[DYNAMIC]/currentPath
    const grandParentPath = path.slice(0, path.length - 2).join('/');
    router.push(grandParentPath || '/');
  };

  return (
    <>
      {showMobileNav ? (
        <div className="fixed sm:hidden h-screen w-full bg-gray-syn8 opacity-50 z-40" />
      ) : null}
      <nav
        className={`${showNav ? 'block' : 'hidden'} ${
          showMobileNav ? 'bg-gray-syn8 bg-opacity-100' : 'bg-black'
        } sm:bg-black h-20 sm:bg-opacity-50 fixed top-0 inset-x-0 align-middle z-40 backdrop-filter backdrop-blur-xl`}
        ref={navRef}
      >
        {showMobileNav ? (
          <div className="fixed sm:hidden w-full flex-col mt-20 py-2 bg-gray-syn8 justify-center shadow-xl">
            {navItems.map(({ navItemText, url, isLegal }, index) => (
              <React.Fragment key={index}>
                <div className="container mx-auto items-center">
                  <NavBarNavItem
                    navItemText={navItemText}
                    url={url}
                    isLegal={isLegal}
                  />
                </div>
                <div className="pl-6-percent">
                  <div className="border-b-1 border-gray-border" />
                </div>
              </React.Fragment>
            ))}
            <NetworkComponent />
            <WalletComponent />
          </div>
        ) : null}
        <div className="container mx-auto h-full flex">
          <div className="flex flex-1 sm:hidden items-center -ml-3">
            {showBackButton ? (
              <button
                type="button"
                onClick={handleBackButton}
                className="flex sm:hidden justify-start items-center p-3"
              >
                <Image
                  src="/images/back-chevron-large.svg"
                  alt="back button"
                  width={20}
                  height={20}
                />
              </button>
            ) : null}
          </div>
          <div className="hidden sm:flex flex-1 items-center">
            {navItems.map(({ navItemText, url, isLegal }, index) => (
              <NavBarNavItem
                key={index}
                navItemText={navItemText}
                url={url}
                isLegal={isLegal}
              />
            ))}
          </div>
          <div className="flex w-max items-center">
            <Link href="/">
              <a href="/">
                <img src="/images/logo.svg" alt="Syndicate Logo" />
              </a>
            </Link>
          </div>
          <div className="flex flex-1 sm:hidden justify-end items-center -mr-3">
            <button
              type="button"
              className={`flex items-center p-3`}
              onClick={toggleMobileNav}
            >
              {showMobileNav ? (
                <Image
                  src="/images/actionIcons/close-menu.svg"
                  width="20"
                  height="20"
                  alt="close navigation"
                />
              ) : (
                <Image
                  src="/images/actionIcons/menu.svg"
                  width="20"
                  height="20"
                  alt="open navigation"
                />
              )}
            </button>
          </div>
          <div className="relative hidden sm:flex sm:space-x-3 flex-1 justify-end items-center">
            <div
              className={`flex space-x-3 ${hideWalletAndEllipsis && 'hidden'}`}
            >
              <NetworkComponent />
              <WalletComponent />
              <MoreMenu />
            </div>

            {dotIndicatorOptions?.length ? (
              <>
                <DotIndicators
                  options={dotIndicatorOptions}
                  activeIndex={activeIndex}
                  orientation={DotIndicatorsOrientation.HORIZONTAL}
                  customClasses="pr-5"
                />

                {activeIndex > 0 ? (
                  <NavButton
                    handlePrevious={setActiveIndex}
                    type={NavButtonType.HORIZONTAL}
                  />
                ) : null}
              </>
            ) : null}

            {showCloseButton && (
              <NavButton type={NavButtonType.CLOSE} onClick={handleExitClick} />
            )}
          </div>
        </div>
        {showCreateProgressBar && account && (
          <ProgressBar
            percentageWidth={
              preClubCreationStep ? 0 : ((currentStep + 1) / steps.length) * 100
            }
            tailwindColor="bg-green"
          />
        )}
      </nav>
    </>
  );
};

export default Header;
