import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { NavBarNavItem } from "./navbarItems";
import { UserProfileWrapper } from "./UserProfileWrapper";
import WalletComponent from "./wallet";

interface props {
  backLink: string;
  show?: boolean;
}

// links to show on the navbar
const navbarItems = [
  {
    url: "/clubs",
    urlText: "Portfolio",
  },
  {
    url: "/discover",
    urlText: "Discover",
  },
];
const Header: React.FC<props> = ({ backLink = null, show = true }) => {
  const router = useRouter();

  return (
    <nav
      className={`${
        show ? "block" : "hidden"
      } bg-black h-20 fixed top-0 inset-x-0 align-middle bg-opacity-50 z-20 backdrop-filter backdrop-blur-xl`}
    >
      <div className="container mx-auto flex justify-between h-full">
        {/* This backlink is only displayed on mobile sizes */}
        {backLink ? (
          <div className="md:flex-1 mr-4 md:mr-0">
            <div className="md:hidden float-left vertically-center">
              <Link href="/clubs">
                <a>
                  <img
                    src="/images/back-chevron-large.svg"
                    alt="back-chevron-large"
                  />
                </a>
              </Link>
            </div>
          </div>
        ) : null}

        {router.pathname.includes("/clubs/create") &&
        !router.pathname.includes("/clubs/create/club") ? (
          <div className="md:flex-1 flex items-center">
            <p className="text-sm sm:text-base text-white leading-7 font-light">
              Create an Investment Club
            </p>
          </div>
        ) : (
          <div
            className="md:flex-1 flex items-center"
            style={{ maxWidth: `${(1 / 3) * 100}%` }}
          >
            {" "}
            {/* Navbar links  */}
            {navbarItems.map((item, index) => {
              const { url, urlText } = item;
              return <NavBarNavItem key={index} url={url} urlText={urlText} />;
            })}
          </div>
        )}

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
          <div className="float-right flex items-center space-x-1 vertically-center hidden sm:block">
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
