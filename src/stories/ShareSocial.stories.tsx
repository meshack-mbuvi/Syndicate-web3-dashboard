import { ShareCard } from '@/components/social';

export default {
  title: '3. Molecules/Share Social'
};

const Template = (args) => {
  return <ShareCard {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  imageOptions: [
    'https://media3.giphy.com/media/nV92wySC3iMGhAmR71/giphy.gif',
    'https://media4.giphy.com/media/ZmgSpGW4p8EUspn0Uk/giphy.gif',
    'https://media.giphy.com/media/lMameLIF8voLu8HxWV/giphy.gif'
  ],
  description:
    'Just made an investment distribution for Alpha Beta Club (✺ABC) on Syndicate 🎉 Check our dashboard for details on how much you will be receiving.',
  URL: 'https://app.syndicate.io'
};
