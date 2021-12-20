import React from "react";
import ActiveLink from "@/components/syndicates/shared/ActiveLink";

interface IProps {
  url: string;
  urlText: string;
  customClasses?: string;
}

export const NavBarNavItem: React.FC<IProps> = ({ url, urlText, customClasses = "" }) => {
  return (
    <ActiveLink href={url} customActive="border-b-1 hover:border-opacity-100">
      <div className="h-full mr-3 md:mr-6 lg:mr-9 hover:border-b-1 hover:border-opacity-50 cursor-pointer">
        <a className={`${customClasses} text-sm sm:text-base text-white leading-7 vertically-center inline-block transition-all`}>
          {urlText}
        </a>
      </div>
    </ActiveLink>
  );
};
