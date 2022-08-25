import {
  collectiveSlides,
  SmallCarousel
} from '@/components/shared/smallCarousel';

export default {
  title: '3. Molecules/Small Carousel'
};

const Template = (args) => {
  return <SmallCarousel {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  slides: collectiveSlides
};

export const NoArrows = Template.bind({});
NoArrows.args = {
  slides: collectiveSlides,
  useArrows: false
};
