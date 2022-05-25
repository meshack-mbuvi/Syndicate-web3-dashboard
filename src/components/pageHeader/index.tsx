import React from 'react';
import { H1 } from '../typography';

const PageHeader: React.FC = ({ children }) => {
  return <H1 extraClasses="mb-6">{children}</H1>;
};

export default PageHeader;
