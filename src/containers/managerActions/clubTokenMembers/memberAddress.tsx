import { MEMBER_SIGNED_QUERY } from "@/graphql/queries";
import { formatAddress } from "@/utils/formatAddress";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SignedIcon } from "../shared/signedIcon";

export const MemberAddressComponent = (row) => {
  const { memberAddress } = row;

  const {
    query: { clubAddress },
  } = useRouter();

  const { data, refetch } = useQuery(MEMBER_SIGNED_QUERY, {
    variables: {
      clubAddress,
      address: memberAddress,
    },
    skip: !clubAddress || !memberAddress,
    context: { clientName: "backend" },
  });

  useEffect(() => {
    if (memberAddress) {
      refetch();
    }
  }, [memberAddress]);

  return (
    <div className="flex space-x-3 align-center text-base leading-6">
      <Image width="32" height="32" src={"/images/user.svg"} alt="user" />
      <p className="flex my-1">
        {formatAddress(memberAddress, 6, 6)}{" "}
        {data?.Financial_memberSigned == true && (
          <span className="my-auto ml-1">
            <SignedIcon />
          </span>
        )}
      </p>
    </div>
  );
};
