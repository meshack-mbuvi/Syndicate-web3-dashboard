import { SkeletonLoader } from "@/components/skeletonLoader";
import React from "react";

interface Props {
  allowlistEnabled: boolean;
  modifiable: boolean;
  tranferable: boolean;
  className?: string;
  showSkeletonLoader: boolean;
}
const PermissionCard = (props: Props): JSX.Element => {
  const {
    allowlistEnabled,
    modifiable,
    tranferable,
    className,
    showSkeletonLoader,
  } = props;

  return (
    <div className={className}>
      {showSkeletonLoader ? (
        <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
      ) : (
        <>
          <p className="text-base text-gray-500 leading-loose">Permissions</p>
          <div className="flex text-base leading-5">
            <div className="flex">
              <img src="/images/User_Check.svg" alt="allowlist" />
              <p className="ml-2">
                {allowlistEnabled
                  ? "Allowlist enabled"
                  : "Allowlist not enabled"}
              </p>
            </div>
            <div className="flex ml-7">
              <img src="/images/Locked.svg" alt="modifiable" />
              <p className="ml-2">
                {modifiable ? "Modifiable" : "Not modifiable"}
              </p>
            </div>
            <div className="flex ml-7">
              <img src="/images/Locked.svg" alt="transferable" />
              <p className="ml-2">
                {tranferable
                  ? "Tranferable by members"
                  : "Not tranferable by members"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionCard;
