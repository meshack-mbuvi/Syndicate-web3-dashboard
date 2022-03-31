import React from 'react';

export default {
  title: 'Quarks/Typography'
};

const Template = (args) => (
  <div className="space-y-4 text-white" {...args}>
    <h1>{args.h1}</h1>
    <h2>{args.h2}</h2>
    <h3>{args.h3}</h3>
    <h4>{args.h4}</h4>
    <p>{args.body}</p>
    <p className="text-sm">{args.smallBody}</p>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  h1: 'H1, Regular',
  h2: 'H2 Regular',
  h3: 'H3 Regular',
  h4: 'H4 Bold',
  body: 'Body, Regular',
  smallBody: 'Small Body, Regular'
};
