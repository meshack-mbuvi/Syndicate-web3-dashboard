import { useEffect, useState } from "react";
import { MemberItem } from "./memberItem";
import { AllMembersModal } from "./allMembersModal";
import { SkeletonLoader } from "@/components/skeletonLoader";
interface DAOProps {
  name: string;
  url: string;
  image: string;
  members: { avatar: string; name: string }[];
}

export const SyndicateDAOItem = (props: DAOProps) => {
  const { name, url, image, members } = props;
  const [showAllMembers, setShowAllMembers] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const showFullMembersList = () => {
    setShowAllMembers(true);
  };

  const hideFullMembersList = () => {
    setShowAllMembers(false);
  };

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <div className="mb-8 w-full">
      <a href={url} target="_blank" rel="no-referrer">
        <div
          style={{
            background: `url(${image}) no-repeat center center`,
            backgroundSize: "cover",
            backgroundColor: "#3b3939",
          }}
          className="w-full mb-2 rounded-md perfect-square"
        ></div>
        <p className="text-md md:text-lg font-whyte-light mt-2">{name}</p>
      </a>
      <div className="flex flex-shrink items-center">
        <div className="flex mt-1">
          {members.length &&
            members.length > 2 &&
            members.slice(0, 2).map((member, index) => {
              return <MemberItem {...member} key={index} />;
            })}
          {members.length &&
            members.length <= 2 &&
            members.map((member, index) => {
              return <MemberItem {...member} key={index} />;
            })}
        </div>
        {members.length > 2 ? (
          <div className="mt-2">
            <p
              onClick={() => showFullMembersList()}
              className="transition font-whyte-light text-xs text-gray-3 cursor-pointer w-fit-content hover:text-white"
            >{`+ ${members.slice(2).length} more`}</p>
          </div>
        ) : null}
      </div>
      <AllMembersModal
        name={name}
        members={members}
        showAllMembers={showAllMembers}
        hideFullMembersList={hideFullMembersList}
      />
    </div>
  );
};
