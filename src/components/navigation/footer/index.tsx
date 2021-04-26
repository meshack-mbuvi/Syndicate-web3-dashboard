import React from "react";
import { homePageConstants } from "src/components/syndicates/shared/Constants";

const Footer = () => {
  const { homeFooterText } = homePageConstants;
  return (
    <footer className="font-extralight flex justify-center w-full m-auto mb-8">
      <div className="flex justify-between">
        <p className="text-white flex justify-center p-8 px-10 sm:px-18 mx-auto text-sm text-center">
          {homeFooterText}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
