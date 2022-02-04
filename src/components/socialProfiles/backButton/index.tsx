import Link from "next/link";
import { useEffect, useState } from "react";

const BackButton: React.FC<{
  isSticky?: boolean;
  topOffset?: string;
  customClasses?: string;
  transform: any;
  isHidden?: boolean;
}> = ({
  isSticky = true,
  topOffset = null,
  customClasses = "",
  transform = "translateY(-50%)",
  isHidden = false,
}) => {
  // introduced React hooks because isHidden changed from false to true
  // but this component did not update if isHidden changed
  const [hiddenClass, setHiddenClass] = useState("");
  useEffect(() => setHiddenClass(isHidden ? "hidden" : ""), [isHidden]);

  return (
    <div
      className={`bg-red-500 ${
        isSticky ? "sticky" : "fixed"
      } ${customClasses} w-0 h-0 z-30 transition-all`}
      style={{ top: topOffset ? topOffset : "0px" }}
    >
      <div
        className={`relative hidden sm:block -left-9 sm:-left-14 xl:-left-20 -bottom-6 cursor-pointer w-14 h-14 rounded-full py-4 lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20 transition-all duration-300 ${
          isSticky && "top-11"
        }`}
        style={{ transform: "translateY(-50%)" }}
      >
        <Link href="/clubs">
          <a className={hiddenClass}>
            <svg
              style={{ left: "-1px" }}
              className="relative mx-auto vertically-center fill-current text-gray-syn5"
              width="13"
              height="23"
              viewBox="0 0 13 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 11.0195C0 11.3369 0.114258 11.6162 0.355469 11.8574L10.4229 21.6963C10.6387 21.9248 10.918 22.0391 11.248 22.0391C11.9082 22.0391 12.416 21.5439 12.416 20.8838C12.416 20.5537 12.2764 20.2744 12.0732 20.0586L2.83105 11.0195L12.0732 1.98047C12.2764 1.76465 12.416 1.47266 12.416 1.15527C12.416 0.495117 11.9082 0 11.248 0C10.918 0 10.6387 0.114258 10.4229 0.330078L0.355469 10.1816C0.114258 10.4102 0 10.7021 0 11.0195Z" />
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BackButton;
