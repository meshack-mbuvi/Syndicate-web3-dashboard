import React from "react";
import { connect } from "react-redux";

import ActiveSyndicates from "./active";

const MySyndicates = () => {
  return (
    <div>
      {/* show active syndicates here */}
      <ActiveSyndicates />

      {/* show inactive syndicates here */}
      <div>Inactive syndicates</div>
    </div>
  );
};

export default connect()(MySyndicates);
