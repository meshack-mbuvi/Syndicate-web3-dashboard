import React from "react";
import PropTypes from "prop-types";
import Head from "src/components/syndicates/shared/HeaderTitle";
import Layout from "src/components/layout";

/**
 * Manages messages
 */
const MessagesPage = () => {
  return (
    <Layout>
      <Head title="Messages" />
      <div>Will manage messages</div>
    </Layout>
  );
};

MessagesPage.propTypes = {
  props: PropTypes.any,
};

export default MessagesPage;
