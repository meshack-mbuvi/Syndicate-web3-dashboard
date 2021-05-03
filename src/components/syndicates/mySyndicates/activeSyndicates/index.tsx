import React from "react";
import SyndicateItem, { Header } from "../../shared";

const styles = [
  "lawn-green",
  "pinky-blue",
  "yellowish-light-blue",
  "violet-red",
  "violet-yellow",
];

export const ActiveSyndicates = (props: { syndicates }) => {
  const { syndicates } = props;
  return (
    <div className="mt-4">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden">
              <table className="min-w-full">
                <Header />
                <tbody>
                  {syndicates
                    ? syndicates.map((syndicate, index) => (
                        <SyndicateItem
                          key={syndicate.address}
                          {...syndicate}
                          styles={styles[index]}
                        />
                      ))
                    : "No syndicates currently"}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSyndicates;
