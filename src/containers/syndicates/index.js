import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import CreateSyndicate from "src/components/syndicates/createSyndicate";
import PageHeader from "src/components/pageHeader";
import { showWalletModal } from "src/redux/actions/web3Provider";
import Button from "src/components/buttons";
import Layout from "src/components/layout";

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const Syndicates = (props) => {
  // retrieve contract details
  const {
    web3: { contract },
    dispatch,
  } = props;

  // controls show/hide new syndicate creation modal
  const [showModal, setShowModal] = useState(false);

  const showSyndicateForm = () => {
    // Trigger wallet connection if wallet is not connected
    if (!contract) {
      return dispatch(showWalletModal());
    }
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="w-full">
        {/* Show page header and button to create new syndicate */}
        <div className="flex justify-between w-full">
          <PageHeader>My Syndicates</PageHeader>

          <div className="mb-4">
            <Button
              customClasses="border border-white h-12 w-48 p-3 pt-3 text-sm"
              onClick={showSyndicateForm}
            >
              Create a syndicate
            </Button>
          </div>
        </div>
        {/* Component to create syndicate  */}
        <CreateSyndicate {...{ showModal, setShowModal }} />
      </div>
    </Layout>
  );
};

Syndicates.propTypes = {
  props: PropTypes.any,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps)(Syndicates);
