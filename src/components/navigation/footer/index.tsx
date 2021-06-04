import React from "react";
import { syndicateDetailsConstants } from "src/components/syndicates/shared/Constants";

const Footer = ({ extraClasses = "" }) => {
  const { syndicateDetailsFooterText, syndicateDetailsSecurityFooterText  } = syndicateDetailsConstants;

  return (
    <footer className={`${extraClasses} w-full border-t border-gray-600 pt-8 pb-8`}>
      <p className="text-sm text-gray-600">{syndicateDetailsFooterText}</p>
      <br/>
      <p className="text-sm text-gray-600">{syndicateDetailsSecurityFooterText}</p>
      <ul className="text-sm mt-8">
          <li className="sm:inline mb-3 mr-3 "><a href="https://www.notion.so/syndicateprotocol/Syndicate-411691f0a88b4e909b46796965ee11c1">About</a></li>
          <li className="sm:inline mb-3 mr-3 "><a href="https://www.notion.so/Careers-at-Syndicate-1ded759492c04f93837837634df35432">Careers</a></li>
          <li className="sm:inline mb-3 mr-3 "><a href="mailto:hello@syndicateprotocol.org">Contact</a></li>
          <li className="sm:inline mb-3 mr-3 text-gray-600 whitespace-nowrap">© 2021 Syndicate</li>
      </ul>
    </footer>
  );
};

export default Footer;


