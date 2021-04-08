import { addSyndicates } from "@/redux/actions/syndicates";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PageHeader from "src/components/pageHeader";
import {
  default as ActiveSyndicates,
  default as InActiveSyndicates,
} from "./activeSyndicates";

/**
 * My Syndicates: IF their wallet (a) is leading a syndicate or
 * (b) has deposited into a syndicate, the syndicates shows up on
 * this list. If the syndicate has been marked by the lead as
 *  “inactive,” the syndicate shows up in the inactive list.
 * Data is pulled from the smart contract and syndicate’s wallet state.
 * @returns
 */
const MySyndicates = (props) => {
  const {
    web3: { syndicateInstance },
    syndicates,
    dispatch,
  } = props;

  const [loading] = useState<boolean>(false);

  /**
   * We need to be sure syndicateInstance is initialized before retrieving events.
   */
  useEffect(() => {
    if (syndicateInstance) {
      dispatch(addSyndicates(props.web3));
    }
  }, [syndicateInstance]);

  // active syndicates are shown from this object
  const activeSyndicates = syndicates.filter((syndicate) => {
    return syndicate.inactive === false;
  });

  // inactive syndicate do not have custom styling like above
  const inActiveSyndicates = syndicates.filter(
    (syndicate) => syndicate.inactive === true
  );

  return (
    <div className="mt-4">
      {!loading ? (
        <>
          {syndicates.length ? (
            ""
          ) : (
            <div className="flex justify-center text-center flex-col">
              <p className="text-2xl">
                There are no syndicates you are leading or have invested in at
                the moment.
              </p>
              <p className="text-2xl">Please create a new fund</p>
            </div>
          )}
          {/* show active syndicates here */}
          {syndicates.length ? (
            <div>
              <PageHeader>Active</PageHeader>
              <ActiveSyndicates syndicates={activeSyndicates} />
            </div>
          ) : (
            ""
          )}

          {/* show inactive syndicates here */}
          {inActiveSyndicates.length ? (
            <div className="mt-8">
              <PageHeader>Inactive</PageHeader>
              <InActiveSyndicates syndicates={inActiveSyndicates} />
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        "Hang tight. We are rerieving your syndicates"
      )}
    </div>
  );
};

MySyndicates.propTypes = {
  props: PropTypes.any,
};

const mapStateToProps = (state) => {
  const { web3Reducer, syndicatesReducer } = state;
  const { web3 } = web3Reducer;
  const { syndicates } = syndicatesReducer;

  return { web3, syndicates };
};

MySyndicates.propTypes = {
  syndicates: PropTypes.any,
  syndicateInstance: PropTypes.any,
  web3: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps)(MySyndicates);
