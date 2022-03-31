import React, { useState } from 'react';
import { SearchInput } from '@/containers/managerActions/shared/searchInput';

export default {
  title: 'Atoms/Input Field/Search Input',
  component: SearchInput
};

const Template = (args) => {
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
Default.args = {
  placeholder: 'Placeholder label'
};
