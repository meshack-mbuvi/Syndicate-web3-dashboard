import React from "react";
import Brand from "./brand";

// Other components
import Notification from "./notification";
import Wallet from "./wallet";
import UserProfile from "./userProfile";
import Transaction from "./transaction";
import { UserProfileWrapper } from "./UserProfileWrapper";

import { NavBarNavItem } from "./navbarItems";

const navbarLinks = [
  { url: "/discover", urlText: "Discover" },
  { url: "/syndicates", urlText: "Syndicates" },
  { url: "/messages", urlText: "Messages" },
  { url: "/feed", urlText: "Feed" },
];

const Header = () => {
  return (
    <>
      <header className="divide-y border-b border-gray-90">
        <div className="flex flex-row items-center justify-between mx-auto">
          <div className="flex justify-between">
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
