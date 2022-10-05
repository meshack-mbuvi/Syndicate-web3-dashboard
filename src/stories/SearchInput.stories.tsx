import { SearchInput } from '@/components/inputs';
import { useState } from 'react';

export default {
  title: '2. Atoms/Input Field/Search Input'
};

const Template = () => {
  const [value, setValue] = useState('');
  return (
    <SearchInput
      onChangeHandler={(e) => {
        setValue(e.target.value);
      }}
      searchValue={value}
    />
  );
};

export const Default = Template.bind({});
