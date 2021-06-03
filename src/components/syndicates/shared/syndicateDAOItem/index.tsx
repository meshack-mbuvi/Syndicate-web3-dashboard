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
      className={`flex flex-col ml-2 ${
        order === syndicateDAOs.length - 1 ? "" : "mr-2"
      }`}
    >
      <div
        style={{
          background: `url(${image}) no-repeat center center`,
          backgroundSize: "cover",
          backgroundColor: "#1B1D20",
        }}
        className="flex-shrink rounded-md w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gray-90"
      ></div>
      <p className="text-sm md:text-lg font-whyte-light mt-2">
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
