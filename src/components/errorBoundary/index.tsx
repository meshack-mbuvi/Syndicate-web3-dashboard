import React from 'react';
import { H2 } from '../typography';

export const ErrorBoundary = ({ children }: { children }): JSX.Element => {
  try {
    // just render children. Everything is fine here
    return children;
  } catch (error) {
    // An error occured in the component tree
    return (
      <div>
        <H2 regular>Something went wrong. Try reloading your browser.</H2>
        If this problem persists, please contact us for help
      </div>
    );
  }
};

export default ErrorBoundary;
