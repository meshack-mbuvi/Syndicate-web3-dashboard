import React from 'react';
import { CreateClubOrCollective } from '@/components/syndicates/portfolioAndDiscover/portfolio/portfolioEmptyState/clubAndCollective';

export default {
  title: '3. Molecules/Portfolio/Empty States'
};

const Template = (args) => {
  return <CreateClubOrCollective {...args} />;
};

export const Default = Template.bind({});
Default.args = {};
