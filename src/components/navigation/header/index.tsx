import Link from "next/link";
import React from "react";
import { UserProfileWrapper } from "./UserProfileWrapper";
import WalletComponent from "./wallet";

interface props {
  backLink: string;
}
const Header = ({ backLink }: props) => {
  return (
    <nav className="bg-black h-20 fixed top-0 inset-x-0 align-middle border-b border-gray-800 py-4 bg-opacity-70 z-10 backdrop-filter backdrop-blur-xl">
      <div className="container mx-auto flex justify-between h-full">
        <div className="md:flex-1 mr-4 md:mr-0">
          {/* This backlink is only displayed on mobile sizes */}
          {backLink ? (
            <div className="md:hidden float-left vertically-center">
              <Link href="/syndicates">
                <a>
                  <img src="/images/back-chevron-large.svg" />
                </a>
              </Link>
            </div>
          ) : null}
        </div>

        {/* logo */}
        <div className="md:flex-1 space-x-1 mx-auto">
          <Link href="/">
            <img
              src="/images/logo.svg"
              className="center"
              alt="Syndicate Logo"
            />
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
