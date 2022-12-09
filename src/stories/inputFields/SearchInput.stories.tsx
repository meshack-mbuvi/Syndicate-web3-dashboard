import React, { useState } from 'react';
import { SearchInput } from '@/containers/managerActions/shared/searchInput';

export default {
  title: '2. Atoms/Input Field/Search Input (Manager Actions)',
  component: SearchInput
};

const Template = (args: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <SearchInput
      {...args}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  placeholder: 'Placeholder label'
};
