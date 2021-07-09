import syndicateDAOs from "@/syndicateDAOs.json";
import { SyndicateDAOItem } from "@/components/syndicates/shared/syndicateDAOItem";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Discover = () => {
  return (
    <div>
      {syndicateDAOs.length ? (
        <div className="mt-2">
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6 py-4">
            {syndicateDAOs.map((syndicate, index) => {
              return <SyndicateDAOItem {...syndicate} key={index} />;
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
          <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom bg-gray-6 p-10">
            <div className="w-full flex justify-center mb-6">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="h-12 text-gray-500 text-7xl"
              />
            </div>
            <p className="font-semibold text-2xl text-center">
              No Syndicates Found
            </p>
            <p className="text-sm my-5 font-normal text-gray-dim text-center">
              We couldn't find any syndicate at the moment. Please check again
              later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
