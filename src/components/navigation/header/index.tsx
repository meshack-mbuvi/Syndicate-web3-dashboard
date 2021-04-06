import React from "react";
import Brand from "./brand";
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
  return (
    <>
      <header className="divide-y border-b border-gray-90 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between mx-auto">
          <div className="flex flex-col sm:flex-row justify-between">
            <Brand />
            {navbarLinks.map(({ url, urlText }) => (
              <NavBarNavItem {...{ url, urlText }} key={url} />
            ))}
          </div>

          <div className="flex justify-between mr-4">
            <Transaction />
            <Notification />
            <UserProfileWrapper>
              <UserProfile />
              <Wallet />
            </UserProfileWrapper>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
