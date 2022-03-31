import Layout from '@/components/layout';
import GettingStarted from '@/components/syndicates/depositSyndicate/gettingStarted';
import Head from '@/components/syndicates/shared/HeaderTitle';
import { NextPage } from 'next';
import React from 'react';

const ClubInvitePage: NextPage = () => (
  <Layout>
    <Head title="Getting started" />
    <GettingStarted />
  </Layout>
);

export default ClubInvitePage;
