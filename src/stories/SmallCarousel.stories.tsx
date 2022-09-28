import {
  collectiveSlides,
  SmallCarousel
} from '@/components/shared/smallCarousel';

export default {
  title: '3. Molecules/Small Carousel'
};

const Template = (args: any) => {
  return <SmallCarousel {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  slides: collectiveSlides
};

export const NoArrows = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
NoArrows.args = {
  slides: collectiveSlides,
  useArrows: false
};
