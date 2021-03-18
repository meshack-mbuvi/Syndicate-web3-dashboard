import PropTypes from "prop-types";
import React from "react";

/**
 * This is the parent component for all other components in the tree.
 * It is rendered below the navigation bar and provides a uniform layout for the
 * main content
 * @params props an object that children which is an html node
 */
const ContentWrapper = (props) => {
  const { children } = props;
  return <div className="flex w-auto w-full py-4 px-8">{children}</div>;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
