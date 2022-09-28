import React from 'react';
import { CreateClubOrCollective } from '@/components/syndicates/portfolioAndDiscover/portfolio/portfolioEmptyState/clubAndCollective';

export default {
  title: '3. Molecules/Portfolio/Empty States'
};

const Template = (args: any) => {
  return <CreateClubOrCollective {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {};
