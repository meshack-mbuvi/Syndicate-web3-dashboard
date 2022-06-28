import { CollectiveMember } from '@/components/collectives/member';

export default {
  title: '3. Molecules/Collectives/Member'
};

const Template = (args) => {
  return <CollectiveMember {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  profilePicture: '/images/collectives/alex.jpg',
  username: 'alexzandi',
  alsoMemberOf: ['Club A', 'Club B', 'Club C', 'Club D', 'Club E', 'Club F'],
  maxClubsToDisplay: 3
};
