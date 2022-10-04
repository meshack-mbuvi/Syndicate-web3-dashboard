import React from 'react';
import { syndicateDetailsConstants } from 'src/components/syndicates/shared/Constants';

const Footer: React.FC<{ extraClasses: string }> = ({ extraClasses = '' }) => {
  const { syndicateDetailsFooterText } = syndicateDetailsConstants;

  return (
    <footer className={`${extraClasses} w-full pt-5 border-gray-matterhorn`}>
      <div className={`mx-auto`}>
        <div className="md:flex justify-between mb-5">
          <p className="text-sm text-gray-syn5">© 2022 Syndicate Inc.</p>
          <ul className="mt-8 md:mt-0 text-sm text-gray-syn4 space-y-3 md:space-x-10">
            <li className="md:inline">
              <a
                href="https://www.syndicate.io/about"
                target="_blank"
                rel="noreferrer"
              >
                About
              </a>
            </li>
            <li className="md:inline">
              <a
                href="http://jobs.ashbyhq.com/syndicate"
                target="_blank"
                rel="noreferrer"
              >
                Careers
              </a>
            </li>
            <li className="md:inline">
              <a
                href="https://www.syndicate.io/community"
                target="_blank"
                rel="noreferrer"
              >
                Community
              </a>
            </li>
            <li className="md:inline">
              <a
                href="https://www.syndicate.io/terms"
                target="_blank"
                rel="noreferrer"
              >
                Terms
              </a>
            </li>
            <li className="md:inline">
              <a
                href="https://www.syndicate.io/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy
              </a>
            </li>
            <li className="md:inline mb-3">
              <a href="mailto:hello@syndicate.io">Contact</a>
            </li>
          </ul>
        </div>
        <p className="text-xs text-gray-syn5">{syndicateDetailsFooterText}</p>
      </div>
    </footer>
  );
};

export default Footer;
