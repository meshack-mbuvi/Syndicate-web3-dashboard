import React from 'react';
import CreateEmptyState from '@/components/syndicates/portfolioAndDiscover/portfolio/portfolioEmptyState/createEmptyState';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: '3. Molecules/Portfolio/Empty States',
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};

const Template = (args: any) => {
  return <CreateEmptyState {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {};
