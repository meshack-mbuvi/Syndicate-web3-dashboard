import { SkeletonLoader } from "@/components/skeletonLoader";
import React from "react";

interface Props {
  allowlistEnabled: boolean;
  modifiable: boolean;
  transferable: boolean;
  className?: string;
  showSkeletonLoader: boolean;
}
const PermissionCard = (props: Props): JSX.Element => {
  const {
    allowlistEnabled,
    modifiable,
    transferable,
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
          <div className="flex md:flex-row flex-col text-base leading-5 mt-2">
            <div className="flex">
              <img src="/images/User_Check.svg" alt="allowlist" />
              <p className="ml-2">
                {allowlistEnabled
                  ? "Allowlist enabled"
                  : "Allowlist not enabled"}
              </p>
            </div>
            <div className="flex md:ml-8">
              <img src="/images/Locked.svg" alt="modifiable" />
              <p className="ml-2">
                {modifiable ? "Modifiable" : "Not modifiable"}
              </p>
            </div>
            <div className="flex md:ml-8">
              <img src="/images/Locked.svg" alt="transferable" />
              <p className="ml-2">
                {transferable
                  ? "Transferable by members"
                  : "Not transferable by members"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionCard;
