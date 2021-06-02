import Head from "next/head";
import React from "react";

// Props description
interface HeaderTitleProps {
  // page title
  title: string;
}

const HeaderTitle = (props: HeaderTitleProps) => {
  const { title } = props;
  const headerTitle = `${title} | Syndicate Protocol Dashboard`;
  return (
    <Head>
      <title>{headerTitle}</title>
    </Head>
  );
};

export default HeaderTitle;
