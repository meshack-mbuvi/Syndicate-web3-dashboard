import Link from "next/link";
import React from "react";
import { UserProfileWrapper } from "./UserProfileWrapper";
import WalletComponent from "./wallet";
import { NavBarNavItem } from "./navbarItems";

interface props {
  backLink: string;
}

// links to show on the navbar
const navbarItems = [
  { url: "/syndicates", urlText: "Portfolio" },
  {
    url: "/discover",
    urlText: "Discover",
  },
];
const Header = ({ backLink }: props) => {
  return (
    <nav className="bg-black h-20 fixed top-0 inset-x-0 align-middle py-4 bg-opacity-70 z-20 backdrop-filter backdrop-blur-xl">
      <div className="container mx-auto flex justify-between h-full">
        {/* This backlink is only displayed on mobile sizes */}
        {backLink ? (
          <div className="md:flex-1 mr-4 md:mr-0">
            <div className="md:hidden float-left vertically-center">
              <Link href="/syndicates">
                <a>
                  <img src="/images/back-chevron-large.svg" />
                </a>
              </Link>
            </div>
          </div>
        ) : null}

        {/* Navbar links  */}
        <div className="md:flex-1 flex items-center">
          {navbarItems.map((item) => {
            const { url, urlText } = item;
            return <NavBarNavItem url={url} urlText={urlText} />;
          })}
        </div>

        {/* logo */}
        <div className="flex-1 space-x-1 mx-auto w-fit-content flex items-center justify-center">
          <Link href="/">
            <a href="/">
              <img src="/images/logo.svg" alt="Syndicate Logo" />
            </a>
          </Link>
        </div>

        {/* secondary nav */}
        <div className="flex-1">
          <div className="float-right flex items-center space-x-1 vertically-center">
            <UserProfileWrapper>
              <WalletComponent />
            </UserProfileWrapper>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
