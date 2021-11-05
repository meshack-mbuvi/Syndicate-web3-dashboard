import React from "react";

export const MainContent: React.FC = (props) => {
  return (
    <div id="center-column" className={`pt-3 h-full flex flex-col`}>
      <div
        className={`flex flex-col relative px-2 pb-4 no-scroll-bar overflow-y-scroll h-full`}
      >
        {props.children}
      </div>
    </div>
  );
};

// adding another main content for templates
// The intention here is to widen the middle section since input fields
// on the template page are rendered next to each other.
// Also mixing up these two components just makes the code a bit harder to follow.
export const TemplateMainContent: React.FC = (props) => {
  return (
    <div id="center-column" className={`px-12 pt-3 w-1/2 h-full flex flex-col`}>
      <div
        className={`flex flex-col relative px-4 pb-4 no-scroll-bar overflow-y-scroll h-full pl-2`}
      >
        {props.children}
      </div>
    </div>
  );
};
