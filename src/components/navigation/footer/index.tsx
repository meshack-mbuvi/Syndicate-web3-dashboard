import React from "react";
import { syndicateDetailsConstants } from "src/components/syndicates/shared/Constants";

const Footer: React.FC<{extraClasses: string}> = ({ extraClasses = ""}) => {
  const { syndicateDetailsFooterText, syndicateDetailsSecurityFooterText  } = syndicateDetailsConstants;

  return (
    <footer className={`${extraClasses} w-full pt-5 border-gray-matterhorn`}>
      <img className="w-32 sm:w-44 mb-8 sm:mb-12" src="/images/wordmark.svg" alt=""/>
      <div className={`mx-auto`}>
        <p className="text-xs text-gray-syn4">{syndicateDetailsFooterText}</p>
        <p className="text-xs mb-6 sm:mb-8 text-gray-syn4">{syndicateDetailsSecurityFooterText}</p>
        <div className="md:flex justify-between">
          <p className="text-sm text-gray-syn4">© 2021 Syndicate Inc.</p>
          <ul className="mt-8 md:mt-0 text-sm text-gray-syn3">
            <li className="md:inline mb-3 mr-10"><a href="https://www.notion.so/syndicateprotocol/Syndicate-411691f0a88b4e909b46796965ee11c1">About</a></li>
            <li className="md:inline mb-3 mr-10"><a href="https://www.notion.so/Careers-at-Syndicate-1ded759492c04f93837837634df35432">Careers</a></li>
            <li className="md:inline mb-3"><a href="mailto:hello@syndicateprotocol.org">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


