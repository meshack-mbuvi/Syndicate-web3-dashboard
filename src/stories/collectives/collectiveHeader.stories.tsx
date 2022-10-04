import { CollectiveHeader } from '@/containers/collectives/shared/collectiveHeader';

export default {
  title: '3. Molecules/Collectives/CollectiveHeader'
};

const Template = (args: any) => {
  return <CollectiveHeader {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  collectiveName: 'Alpha Beta Punks',
  links: {
    externalLink: '/',
    openSea: '/'
  }
};
