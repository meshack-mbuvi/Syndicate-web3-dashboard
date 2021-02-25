import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer flex justify-center w-full m-auto mt-4">
      <div className="flex justify-between">
        <p className="text-white flex justify-center max-w-4xl p-4 mx-auto text-sm">
          Syndicate v1 was security audited by Quanstamp March 2021.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
