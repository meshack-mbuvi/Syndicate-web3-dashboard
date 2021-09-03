import React from "react";
import { syndicateDetailsConstants } from "src/components/syndicates/shared/Constants";

const Footer = ({ extraClasses = "", disclaimerWidth = "w-1/2" }) => {
  const { syndicateDetailsFooterText, syndicateDetailsSecurityFooterText  } = syndicateDetailsConstants;

  return (
    <footer className={`${extraClasses} w-full border-t pt-5 md:border-white border-gray-matterhorn`}>

      {/* Mobile Disclaimer */}
      <div className="md:w-1/2 mx-auto text-gray-90 block md:hidden">
        <p className="text-sm mb-3">{syndicateDetailsFooterText}</p>
        <p className="text-sm">{syndicateDetailsSecurityFooterText}</p>
      </div>

      {/* Title + Links */}
      <div className="flex flex-col md:flex-row md:items-center items-start justify-between md:mb-16">
      <img className="hidden md:block w-44" src="/images/wordmark.svg" alt=""/>

        <ul className="font-whyte-light mt-8 md:mt-0">
            <li className="md:inline mb-3 mr-10"><a href="https://www.notion.so/syndicateprotocol/Syndicate-411691f0a88b4e909b46796965ee11c1">About</a></li>
            <li className="md:inline mb-3 mr-10"><a href="https://www.notion.so/Careers-at-Syndicate-1ded759492c04f93837837634df35432">Careers</a></li>
            <li className="md:inline mb-3 mr-10"><a href="mailto:hello@syndicateprotocol.org">Contact</a></li>
            <li className="md:inline mb-3 text-gray-90 whitespace-nowrap hidden">© 2021 Syndicate</li>
        </ul>
      </div>

      {/* <h1 className="font-whyte-light block mt-12 sm:hidden">Syndicate</h1> */}
      <img className="block mt-12 md:hidden w-32" src="/images/wordmark.svg"/>

      {/* Desktop Disclaimer */}
      <div className={`md:${disclaimerWidth} mx-auto text-center hidden md:block text-gray-90`}>
        <p className="text-sm mb-3">{syndicateDetailsFooterText}</p>
        <p className="text-sm">{syndicateDetailsSecurityFooterText}</p>
      </div>
    </footer>
  );
};

export default Footer;


