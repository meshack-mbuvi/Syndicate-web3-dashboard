import React from "react";
import Brand from "./brand";

import "./header.css";

// Other components
import Notification from "./notification";
import Wallet from "./wallet";
import PendingTx from "./pendingTx";

const Header = () => {
  // const [isExpanded, toggleExpansion] = useState(false);

  return (
    <header className="header p-1">
      <div className="flex flex-row items-center justify-between mx-auto">
        <Brand />

        <div className="right-top-bar justify-between mr-4">
          <Notification />
          <PendingTx />
          <Wallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
