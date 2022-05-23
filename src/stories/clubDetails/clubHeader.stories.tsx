import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import React from 'react';

export default {
  title: '3. Molecules/Club Details/Club Header',
  component: ClubHeader
};

const Template = (args) => <ClubHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Alpha Beta Club',
  symbol: '✺ABC',
  owner: '0x0563A7aB3Da117e694c6B85f80A20aD5daabd6B9',
  clubAddress: '0x3056adb19b1049e4e6b098a9105830564f519604',
  loading: false,
  totalDeposits: '10000',
  loadingClubDeposits: false,
  managerSettingsOpen: false
};

export const Loading = Template.bind({});
Loading.args = {
  name: '',
  symbol: '',
  owner: '',
  clubAddress: '',
  loading: true,
  totalDeposits: '',
  loadingClubDeposits: true,
  managerSettingsOpen: false
};
