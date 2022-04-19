import React from 'react';

const PageHeader: React.FC = ({ children }) => {
  return <h1 className="text-white text-2xl mb-6">{children}</h1>;
};

export default PageHeader;
