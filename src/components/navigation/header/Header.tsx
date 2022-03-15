import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NavBarNavItem } from "./navbarItems";
import WalletComponent from "./wallet";
import { MoreMenu } from "./moreMenu";

interface props {
  navItems: { navItemText: string; url?: string; isLegal?: boolean }[];
  showBackButton?: boolean;
  showNav?: boolean;
}

const Header: React.FC<props> = ({
  navItems,
  showBackButton = false,
  showNav = true,
}) => {
  const router = useRouter();
  const navRef = useRef(null);
  const [showMobileNav, setShowMobileNav] = React.useState(false);

  useEffect(() => {
    if (showMobileNav) {
      // ideally want to add this to the parent element however parent seems to have sibling elements
      // with overflow  -> adding to body for now
      document.body.classList.add("overflow-y-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-y-hidden");
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
      document.addEventListener("mouseup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [navRef, showMobileNav]);

  useEffect(() => {
    const closeMobileNav = () => {
      setShowMobileNav(false);
    };

    router.events.on("routeChangeStart", closeMobileNav);
    return () => {
      router.events.off("routeChangeStart", closeMobileNav);
    };
  }, [router.events]);

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  const handleBackButton = () => {
    const path = router.pathname.split("/");
    //assumes showBackButton only used on ...[DYNAMIC]/currentPath
    const grandParentPath = path.slice(0, path.length - 2).join("/");
    router.push(grandParentPath || "/");
  };

  return (
    <>
      {showMobileNav ? (
        <div className="fixed sm:hidden h-screen w-full bg-gray-syn8 opacity-50 z-40" />
      ) : null}
      <nav
        className={`${
          showNav ? "block" : "hidden"
        } ${showMobileNav ? "bg-gray-syn8 bg-opacity-100" : "bg-black"} sm:bg-black h-20 sm:bg-opacity-50 fixed top-0 inset-x-0 align-middle z-40 backdrop-filter backdrop-blur-xl`}
        ref={navRef}
      >
        {showMobileNav ? (
          <div className="fixed sm:hidden w-full flex-col mt-20 py-2 bg-gray-syn8 justify-center shadow-xl">
            {navItems.map(({ navItemText, url, isLegal }, index) => (
              <>
                <div className="container mx-auto items-center">
                  <NavBarNavItem
                    key={index}
                    navItemText={navItemText}
                    url={url}
                    isLegal={isLegal}
                  />
                </div>
                <div className="pl-6-percent">
                  <div className="border-b-1 border-gray-border"/>
                </div>
              </>
            ))}
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
            <WalletComponent />
            <MoreMenu />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
