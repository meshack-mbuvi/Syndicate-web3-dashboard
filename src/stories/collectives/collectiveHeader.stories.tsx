import { CollectiveHeader } from '@/containers/collectives/shared/collectiveHeader';

export default {
  title: '3. Molecules/Collectives/CollectiveHeader'
};

const Template = (args) => {
  return <CollectiveHeader {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  collectiveName: 'Alpha Beta Punks',
  links: {
    externalLink: '/',
    openSea: '/'
  }
};
