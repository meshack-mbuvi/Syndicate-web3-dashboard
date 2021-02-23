import PropTypes from "prop-types";
import React from "react";

function Layout({ children }) {
  return (
    <div className="">
      <main className="">{children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
