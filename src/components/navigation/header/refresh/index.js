import React from "react";

import RefreshIcon from "src/images/refresh.png";

export const Refresh = () => {
  return (
    <div className="flex px-4 py-2 mr-2 cursor-pointer">
      <img src={RefreshIcon} className="pr-1 mr-2 h-5 w-6" />
    </div>
  );
};

export default Refresh;
