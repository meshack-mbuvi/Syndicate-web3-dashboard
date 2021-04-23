import window from "global";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavBarNavItem } from "./navbarItems";
// Other components
import Notification from "./notification";
import Transaction from "./transaction";
import UserProfile from "./userProfile";
import { UserProfileWrapper } from "./UserProfileWrapper";
import Wallet from "./wallet";

const navbarLinks = [
  { url: "/discover", urlText: "Discover" },
  { url: "/syndicates", urlText: "Syndicates" },
  { url: "/messages", urlText: "Messages" },
  { url: "/feed", urlText: "Feed" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  let isMobile: boolean = width <= 768;
  const toggleMobileMenuOpen = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="flex flex-wrap w-full border-b border-gray-90 py-2 flex-col md:flex-row">
      <Link href="/">
        <a className="w-fit-content">
          <span className="sr-only">Syndicate</span>
          <img
            src="/images/brand.svg"
            className="ml-6 h-8 my-2 px-4"
            alt="Syndicate Logo"
          />
        </a>
      </Link>
      <button
        className="absolute right-4 md:hidden w-8 h-8 my-2 bg-gray-200 text-gray-600 p-1"
        onClick={toggleMobileMenuOpen}>
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"></path>
        </svg>
      </button>
      <nav
        className={`flex flex-col md:flex-row justify-between sm:mx-4 flex-grow
        ${isMobile && !mobileMenuOpen ? "hidden" : ""}`}>
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col md:flex-row justify-between">
            {navbarLinks.map(({ url, urlText }) => (
              <NavBarNavItem {...{ url, urlText }} key={url} />
            ))}
          </div>
        </div>

        <div className="flex flex-col mx-2 md:flex-row justify-between mr-4">
          <Notification />
          <Transaction />
          <UserProfileWrapper>
            <Wallet />
            <UserProfile />
          </UserProfileWrapper>
        </div>
      </nav>
    </header>
  );
};

export default Header;
