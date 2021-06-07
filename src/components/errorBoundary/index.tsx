import React from "react";

export const ErrorBoundary = (props) => {
  try {
    // just render children. Everything is fine here
    return props.children;
  } catch (error) {
    // An error occured in the component tree
    return (
      <div>
        <h2>Something went wrong. Try reloading your browser.</h2>
        If this problem persists, please contact us for help
      </div>
    );
  }
};

export default ErrorBoundary;
