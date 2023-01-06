import DealDetailsAdminTools from '@/features/deals/components/details/adminTools';

export default {
  title: '3. Molecules/Deals/Details/Admin Tools'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return (
    <DealDetailsAdminTools
      {...args}
      handleExecuteDealClick={() => {
        alert('Clicked Execute deal');
      }}
      handleDissolveDealClick={() => {
        alert('Clicked Dissolve deal');
      }}
    />
  );
};

export const NoBackingYet = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
NoBackingYet.args = {
  hideExecuteButton: false
};

export const HasBacking = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
HasBacking.args = {
  hideExecuteButton: false
};
