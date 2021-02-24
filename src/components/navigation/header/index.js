import React from "react";
import Logo from "../../logo";
import { Link } from "gatsby";

import "./header.css";

function Header() {
  // const [isExpanded, toggleExpansion] = useState(false);

  return (
    <header className="header p-3">
      <div className="flex flex-wrap items-center justify-between max-w-4xl mx-auto md:p-8">
        <Link to="/">
          <Logo />
        </Link>
      </div>
    </header>
  );
}

export default Header;
