import { useState } from "react";
import { MemberItem } from "./memberItem";
import { AllMembersModal } from "./allMembersModal";
interface DAOProps {
  name: string;
  url: string;
  image: string;
  order: number;
  syndicateDAOs: Array<{}>;
  members: { avatar: string; name: string }[];
}

export const SyndicateDAOItem = (props: DAOProps) => {
  const { name, url, image, members, order, syndicateDAOs } = props;
  const [showAllMembers, setShowAllMembers] = useState<boolean>(false);

  const showFullMembersList = () => {
    setShowAllMembers(true);
  };

  const hideFullMembersList = () => {
    setShowAllMembers(false);
  };
  return (
    <div
      // className="mb-8 w-full sm:w-60 md:w-80 lg:w-72"
      className="mb-8 w-full"
    >
      <div
        style={{
          background: `url(${image}) no-repeat center center`,
          backgroundSize: "cover",
          backgroundColor: "#3b3939",
        }}
        // className="bg-red-400 h-80 w-80 md:h-72 mb-2 rounded-md"
        // className="bg-red-400 md:w-80 mb-2 rounded-md perfect-square w-100"
        className="w-full mb-2 rounded-md perfect-square"
      ></div>
      <p className="text-md md:text-lg font-whyte-light mt-2">
        <a href={url} target="_blank" rel="no-referrer">
          {name}
        </a>
      </p>
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
