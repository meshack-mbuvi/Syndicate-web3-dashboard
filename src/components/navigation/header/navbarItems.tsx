import ActiveLink from "@/components/syndicates/shared/ActiveLink";
import React from "react";

interface IProps {
  url: string;
  urlText: string;
  customClasses?: string;
  isLegal?: boolean;
}

export const NavBarNavItem: React.FC<IProps> = ({
  url,
  urlText,
  customClasses = "",
  isLegal = false,
}) => {
  return (
    <ActiveLink href={url} customActive="border-b-1 hover:border-opacity-100">
      <div className="h-full mr-3 md:mr-6 lg:mr-9 border-b-1 border-opacity-0 hover:border-opacity-50 cursor-pointer">
        <a
          className={`${customClasses} text-sm sm:text-base text-white leading-7 vertically-center inline-block transition-all`}
          style={{ lineHeight: "1.3em" }}
        >
          {urlText}
          {isLegal ? (
            <div className="flex pt-1">
              <div className="text-xs mr-1">Powered by</div>
              <img
                src="/images/latham&watkinsllp.svg"
                alt="latham & watkins llp logo"
              />
            </div>
          ) : null}
        </a>
      </div>
    </ActiveLink>
  );
};
