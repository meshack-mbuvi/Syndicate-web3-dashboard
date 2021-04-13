import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "src/components/buttons";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import CreateSyndicate from "src/components/syndicates/createSyndicate";
import MySyndicates from "src/components/syndicates/mySyndicates";
import { showWalletModal } from "src/redux/actions/web3Provider";
import Head from "src/components/syndicates/shared/HeaderTitle";

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const Syndicates = (props: any) => {
  // retrieve contract details
  const {
    web3: { syndicateInstance },
    dispatch,
  } = props;

  // controls show/hide new syndicate creation modal
  const [showModal, setShowModal] = useState(false);

  const showSyndicateForm = () => {
    // Trigger wallet connection if wallet is not connected
    if (!syndicateInstance) {
      return dispatch(showWalletModal());
    }
    setShowModal(true);
  };

  return (
    <Layout>
      <Head title="My Syndicates" />
      <ErrorBoundary>
        <div className="w-full">
          {/* Show page header and button to create new syndicate */}
          <div className="flex justify-between w-full">
            {/* This button is already styed for v2 designs */}
            {/* <div className="mb-2">
            <Button
              customClasses="border border-white h-12 w-48 p-3 pt-3 text-sm"
              onClick={showSyndicateForm}>
              Create a syndicate
            </Button>
          </div> */}
            {/* <div className="mb-2"> */}
            <Button
              customClasses="bottom-4 right-4 absolute bg-blue-light rounded-full h-16 w-16 p-3 pt-3 text-5xl"
              onClick={showSyndicateForm}
            >
              +
            </Button>
            {/* </div> */}
          </div>

          {/* show my syndicates */}
          <MySyndicates />

          {/* Component to create syndicate  */}
          {syndicateInstance ? (
            <CreateSyndicate {...{ showModal, setShowModal }} />
          ) : (
            ""
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

Syndicates.propTypes = {
  syndicate: PropTypes.any,
  dispatch: PropTypes.any,
  web3: PropTypes.any,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps)(Syndicates);
