import React from 'react';
/**
 * Component to show a disclaimer text under the modify club settings page
 * when the manager wants to re-open the club to add a new member.
 * Disclaimer text urges the manager not to change the club's current max deposit amount
 * and max number of members.
 */
export const AmountAndMembersDisclaimer: React.FC = (): React.ReactElement => {
  return (
    <div className="rounded-1.5lg text-yellow-warning bg-yellow-warning bg-opacity-20 py-4 px-5">
      <span className="text-sm">
        We strongly encourage adjusting the “Max amount raising” and “Max number
        of members” settings to your club’s current amounts. This will prevent
        additional members from joining and existing members from depositing
        more.
      </span>
    </div>
  );
};
