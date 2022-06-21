import { B4 } from '@/components/typography';

export interface CollectiveMemberProps {
  profilePicture: string;
  username: string;
  alsoMemberOf?: string[];
  maxClubsToDisplay?: number;
}

export const CollectiveMember: React.FC<CollectiveMemberProps> = ({
  profilePicture,
  username,
  alsoMemberOf,
  maxClubsToDisplay
}) => {
  const clubNamesToDisplay = alsoMemberOf
    ? alsoMemberOf.slice(0, maxClubsToDisplay && maxClubsToDisplay)
    : null;

  return (
    <div className="flex space-x-2 items-center">
      <img
        src={profilePicture}
        alt="Profile"
        className="w-8 h-8 rounded-full"
      />
      <div className="space-y-1">
        <div>@{username}</div>
        {alsoMemberOf && (
          <B4 extraClasses="text-gray-syn4">
            Member of
            {clubNamesToDisplay.map((clubName, index) => {
              return (
                <span key={index}>
                  {' '}
                  ✺{clubName}
                  {index === clubNamesToDisplay.length - 1 ? '' : ','}{' '}
                </span>
              );
            })}
            {clubNamesToDisplay.length < alsoMemberOf.length &&
              `and ${alsoMemberOf.length - clubNamesToDisplay.length} other${
                alsoMemberOf.length - clubNamesToDisplay.length > 1 ? 's' : ''
              }`}
          </B4>
        )}
      </div>
    </div>
  );
};
