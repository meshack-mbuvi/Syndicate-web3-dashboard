/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { setModifiable } from "@/redux/actions/createSyndicate/syndicateOnChainData/modifiable";
import { RootState } from "@/redux/store";
import { classNames } from "@/utils/classNames";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContentTitle, NonEditableSetting } from "../../shared";

const Modifiable: React.FC = () => {
  const dispatch = useDispatch();

  const {
    modifiableReducer: {
      createSyndicate: { modifiable },
    },
  } = useSelector((state: RootState) => state);

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex flex-col">
        <ContentTitle>Should this syndicate be modifiable?</ContentTitle>
        <NonEditableSetting />
      </div>

      <div className="w-full">
        <div
          className={classNames(
            modifiable ? "border-inactive" : "border-blue bg-blue bg-opacity-5",
            `relative rounded-lg border px-6 h-24 shadow-sm flex items-center space-x-3 ${
              modifiable && "hover:border-blue-50"
            } mb-4 cursor-pointer`,
          )}
          onClick={() => dispatch(setModifiable(false))}
        >
          <div className={`flex-shrink-0 ${modifiable && "opacity-60"}`}>
            <img
              className="inline mr-4 h-5"
              src="/images/lockClosed.svg"
              alt="syndicate-protocal"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-base leading-6 text-white ${
                modifiable ? "opacity-50" : "opacity-100"
              }`}
            >
              Not modifiable
            </p>
            <p
              className={`text-sm leading-6 uppercase tracking-wider text-blue ${
                modifiable ? "opacity-50" : "opacity-100"
              }`}
            >
              recommended for most syndicates
            </p>
          </div>
        </div>

        <div
          className={classNames(
            modifiable ? "border-blue bg-blue bg-opacity-5" : "border-inactive",
            `relative rounded-lg border px-6 h-24 shadow-sm flex items-center space-x-3 ${
              !modifiable && "hover:border-blue-50"
            } mb-4 cursor-pointer`,
          )}
          onClick={() => dispatch(setModifiable(true))}
        >
          <div className={`flex-shrink-0 ${!modifiable && "opacity-50"}`}>
            <img
              className="inline mr-4 h-5"
              src="/images/lockOpen.svg"
              alt="syndicate-protocal"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={classNames(
                modifiable ? "text-gray-white" : "text-white opacity-50",
                "text-base leading-6",
              )}
            >
              Modifiable by the syndicate lead
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modifiable;
