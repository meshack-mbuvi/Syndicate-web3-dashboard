import React from "react";
import { syndicateDetailsConstants } from "src/components/syndicates/shared/Constants";

const Footer: React.FC<{extraClasses: string}> = ({ extraClasses = ""}) => {
  const { syndicateDetailsFooterText } = syndicateDetailsConstants;

  return (
    <footer className={`${extraClasses} w-full pt-5 border-gray-matterhorn`}>
      <img className="w-32 sm:w-44 mb-8 sm:mb-12" src="/images/wordmark.svg" alt=""/>
      <div className={`mx-auto`}>
        <p className="text-xs mb-6 sm:mb-8 text-gray-syn4">
          {syndicateDetailsFooterText}
        </p>
        <div className="md:flex justify-between">
          <p className="text-sm text-gray-syn4">
            © 2021 Syndicate Inc.
          </p>
          <ul className="mt-8 md:mt-0 text-sm text-gray-syn3 space-y-3 md:space-x-10">
            <li className="md:inline">
              <a href="https://www.notion.so/syndicateprotocol/Syndicate-411691f0a88b4e909b46796965ee11c1" target="_blank" rel="noreferrer">
                About
              </a>
            </li>
            <li className="md:inline">
              <a href="http://jobs.ashbyhq.com/syndicate" target="_blank" rel="noreferrer">
                Careers
              </a>
            </li>
            <li className="md:inline">
              <a href="https://syndicateprotocol.notion.site/Syndicate-Community-Standards-fb715cbe7e434070bbe7f6c0fcef5a72" target="_blank" rel="noreferrer">
                Community
              </a>
            </li>
            <li className="md:inline">
              <a href="https://docs.google.com/document/d/1U5D6AtmZXrxmgBeobyvHaXTs7p7_wq6V/" target="_blank" rel="noreferrer">
                Terms
              </a>
            </li>
            <li className="md:inline">
              <a href="https://docs.google.com/document/d/1yATB2hQHjCHKaUvBIzEaO65Xa0xHq-nLOEEJlJngg90/" target="_blank" rel="noreferrer">
                Privacy
              </a>
            </li>
            <li className="md:inline mb-3">
              <a href="mailto:hello@syndicateprotocol.org">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


