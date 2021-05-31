import Link from "next/link";
import React from "react";
import { NavBarNavItem } from "./navbarItems";
import Transaction from "./transaction";
import { UserProfileWrapper } from "./UserProfileWrapper";
import Wallet from "./wallet";

const navbarLinks = [{ url: "/syndicates", urlText: "Syndicates" }];

const Header = () => {
  return (
    <nav className="bg-black h-24 top-0 inset-x-0 align-middle border-b border-gray-90 py-4 bg-opacity-95 z-40">
      <div className="max-w-8xl mx-auto px-10 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex space-x-4 items-center">
            {/* logo */}
            <div>
              <a
                href="#"
                className="flex items-center py-5 md:px-2 text-gray-700 hover:text-gray-900"
              >
                <Link href="/">
                  <a className="flex items-center">
                    <span className="sr-only">Syndicate</span>
                    <img
                      src="/images/logo.svg"
                      className="py-4"
                      alt="Syndicate Logo"
                    />
                  </a>
                </Link>
              </a>
            </div>

            {/* primary nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navbarLinks.map(({ url, urlText }) => (
                <NavBarNavItem {...{ url, urlText }} key={url} />
              ))}
            </div>
          </div>

          {/* secondary nav */}
          <div className="flex items-center space-x-1">
            <div className="py-2">
              <Transaction />
            </div>
            <UserProfileWrapper>
              <Wallet />
            </UserProfileWrapper>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
