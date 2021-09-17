import Link from "next/link";

const BackButton = ({
  isSticky = true,
  topOffset = "0px",
  customClasses = "",
}) => {
  return (
    <div
      className={`${
        isSticky ? "sticky" : "fixed"
      } ${customClasses} w-0 h-0 z-30 transition-all`}
      style={{ top: topOffset }}
    >
      <div
        className={`relative hidden sm:block -left-9 sm:-left-14 xl:-left-20 -bottom-6 cursor-pointer w-14 h-14 rounded-full py-4 lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20 ${
          isSticky ? "top-2" : ""
        }`}
      >
        <Link href="/syndicates">
          <a>
            <img
              className="mx-auto relative "
              style={{ left: "-2px" }}
              src="/images/back-chevron-large.svg"
            />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BackButton;
