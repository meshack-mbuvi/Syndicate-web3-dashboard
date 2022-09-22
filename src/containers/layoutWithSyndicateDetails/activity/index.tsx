import React from 'react';
import ActivityTable from './ActivityTable';

const ActivityView: React.FC<{ isOwner: boolean }> = ({ isOwner }) => {
  return (
    <div className="w-full">
      <ActivityTable isOwner={isOwner} />
    </div>
  );
};

export default ActivityView;
