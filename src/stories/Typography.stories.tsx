import {
  E1,
  E2,
  H1,
  H2,
  H3,
  H4,
  L1,
  L2,
  T1,
  T2,
  T3,
  T4,
  T5
} from '@/components/typography';
import React from 'react';

export default {
  title: '1. Quarks/Typography'
};

const Template = (args) => (
  <div className="space-y-4 text-white" {...args}>
    <div className="flex space-x-8">
      <div className="w-1/2 space-y-4">
        <T1>T1, Semibold, 88</T1>
        <T2>T2, Semibold, 72</T2>
        <T3>T3, Semibold, 64</T3>
        <T4>T4, Semibold, 56</T4>
        <T5>T5, Semibold, 48</T5>
      </div>
      <div className="w-1/2 space-y-4">
        <T1 medium>T1, Medium, 88</T1>
        <T2 medium>T2, Medium, 72</T2>
        <T3 medium>T3, Medium, 64</T3>
        <T4 medium>T4, Medium, 56</T4>
        <T5 medium>T5, Medium, 48</T5>
      </div>
    </div>
    <hr className="border-gray-syn6" />
    <div className="flex space-x-8">
      <div className="w-1/2 space-y-3">
        <H1>H1, Medium, 40</H1>
        <H2>H2, Medium, 32</H2>
        <H3>H3, Medium, 24</H3>
        <H4>H4, Medium, 20</H4>
      </div>
      <div className="w-1/2 space-y-3">
        <H1 regular>H1, Regular, 40</H1>
        <H2 regular>H2, Regular, 32</H2>
        <H3 regular>H3, Regular, 24</H3>
        <H4 regular>H4, Regular, 20</H4>
      </div>
    </div>
    <hr className="border-gray-syn6" />
    <L1>{args.label1}</L1>
    <L2>{args.label2}</L2>
    <hr className="border-gray-syn6" />
    <E1>E1, Regular, 16</E1>
    <E2>E2, Regular, 14</E2>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  h1: 'H1, Regular',
  h2: 'H2 Regular',
  h3: 'H3 Regular',
  h4: 'H4 Bold',
  body: 'Body, Regular',
  smallBody: 'Small Body, Regular',
  label1: 'L1, bold, 16',
  label2: 'L2, bold, 14'
};
