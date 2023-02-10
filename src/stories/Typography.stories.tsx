import {
  B1,
  B2,
  B3,
  B4,
  D1,
  D2,
  E1,
  E2,
  H1,
  H2,
  H3,
  H4,
  L1,
  L2,
  M1,
  M2,
  T1,
  T2,
  T3,
  T4,
  T5
} from '@/components/typography';
import React from 'react';

export default {
  title: 'Styles/Typography'
};

const Template = (args: any) => (
  <div className="space-y-4 text-white" {...args}>
    <div className="flex space-x-8">
      <div className="w-1/2 space-y-4">
        <T1>{args.t1_semibold}</T1>
        <T2>{args.t2_semibold}</T2>
        <T3>{args.t3_semibold}</T3>
        <T4>{args.t4_semibold}</T4>
        <T5>{args.t5_semibold}</T5>
      </div>
      <div className="w-1/2 space-y-4">
        <T1 medium>{args.t1_medium}</T1>
        <T2 medium>{args.t2_medium}</T2>
        <T3 medium>{args.t3_medium}</T3>
        <T4 medium>{args.t4_medium}</T4>
        <T5 medium>{args.t5_medium}</T5>
      </div>
    </div>
    <hr className="border-gray-syn6" />
    <div className="flex space-x-8">
      <div className="w-1/2 space-y-3">
        <H1>{args.h1_medium}</H1>
        <H2>{args.h2_medium}</H2>
        <H3>{args.h3_medium}</H3>
        <H4>{args.h4_medium}</H4>
      </div>
      <div className="w-1/2 space-y-3">
        <H1 regular>{args.h1_regular}</H1>
        <H2 regular>{args.h2_regular}</H2>
        <H3 regular>{args.h3_regular}</H3>
        <H4 regular>{args.h4_regular}</H4>
      </div>
    </div>
    <hr className="border-gray-syn6" />
    <L1>{args.l1}</L1>
    <L2>{args.l2}</L2>
    <hr className="border-gray-syn6" />
    <E1>{args.e1}</E1>
    <E2>{args.e2}</E2>
    <hr className="border-gray-syn6" />
    <B1>{args.b1}</B1>
    <B2>{args.b2}</B2>
    <B3>{args.b3}</B3>
    <B4>{args.b4}</B4>
    <hr className="border-gray-syn6" />
    <M1>{args.m1}</M1>
    <M2>{args.m2}</M2>
    <hr className="border-gray-syn6" />
    <D1>{args.d1}</D1>
    <D2>{args.d2}</D2>
  </div>
);

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  t1_semibold: 'T1, Semibold, 88',
  t2_semibold: 'T2, Semibold, 72',
  t3_semibold: 'T3, Semibold, 64',
  t4_semibold: 'T4, Semibold, 56',
  t5_semibold: 'T5, Semibold, 48',

  t1_medium: 'T1, Medium, 88',
  t2_medium: 'T2, Medium, 72',
  t3_medium: 'T3, Medium, 64',
  t4_medium: 'T4, Medium, 56',
  t5_medium: 'T5, Medium, 48',

  h1_medium: 'H1, Medium, 40',
  h2_medium: 'H2, Medium, 32',
  h3_medium: 'H3, Medium, 24',
  h4_medium: 'H4, Medium, 20',

  h1_regular: 'H1, Regular, 40',
  h2_regular: 'H2, Regular, 32',
  h3_regular: 'H3, Regular, 24',
  h4_regular: 'H4, Regular, 20',

  l1: 'L1, bold, 16',
  l2: 'L2, bold, 14',

  e1: 'E1, Regular, 16',
  e2: 'E2, Regular, 14',

  b1: 'B1, Regular, 18',
  b2: 'B2, Regular, 16',
  b3: 'B3, Regular, 14',
  b4: 'B4, Regular, 12',

  m1: 'M1, Regular, 16',
  m2: 'M2, Regular, 14',

  d1: 'D1, Regular, 16',
  d2: 'D2, Regular, 14'
};
