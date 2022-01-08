import { DataStorageInfo } from "@/containers/layoutWithSyndicateDetails/activity/shared/DataStorageInfo";
import { useIsClubOwner } from "@/hooks/useClubOwner";
import { AppState } from "@/state";
import { setCurrentTransaction } from "@/state/erc20transactions";
import Linkify from "linkify-react";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextArea } from "./textArea";

interface IActivityNote {
  saveTransactionNote: (noteValue: string) => void;
  setShowNote: Dispatch<SetStateAction<boolean>>;
}

/**
 * Transaction note component.
 * @param saveTransactionNote function to call gql endpoint to save the note
 * @returns
 */
const ActivityNote: React.FC<IActivityNote> = ({
  saveTransactionNote,
  setShowNote,
}) => {
  const dispatch = useDispatch();
  const {
    transactionsReducer: { currentTransaction },
  } = useSelector((state: AppState) => state);
  const { note } = currentTransaction;
  const isManager = useIsClubOwner();

  const [hover, setHover] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [noteValue, setNoteValue] = useState<string>(note);
  const [noteReadMore, setNoteReadMore] = useState<boolean>(false);
  const [fixedNote, setFixedNote] = useState<boolean>(false);

  const noteREf = useRef(null);
  const setHoverState = (showHover: boolean) => {
    if (!isManager) return;
    if (readOnly && showHover) {
      setHover(true);
    } else if (!showHover) {
      setHover(false);
    }
  };

  const saveNote = () => {
    setReadOnly(true);
    saveTransactionNote(noteValue);
    if (!noteValue) {
      setShowNote(false);
    }
    dispatch(setCurrentTransaction({ ...currentTransaction, note: noteValue }));
  };

  const cancelNote = () => {
    if (noteValue) {
      setReadOnly(true);
    } else {
      setShowNote(false);
    }
  };

  const readMore = () => {
    setNoteReadMore(!noteReadMore);
  };

  useEffect(() => {
    if (!noteValue) {
      setReadOnly(false);
    }
  }, [noteValue]);

  useEffect(() => {
    if (noteREf.current) {
      const noteHeight = noteREf.current.clientHeight;
      if (noteHeight <= 96) {
        setFixedNote(true);
      } else {
        setFixedNote(false);
      }
    }
  });

  return (
    <div
      className={`flex flex-col py-4 px-5 text-base leading-6 ${
        !readOnly || (readOnly && hover) ? "bg-black rounded-1.5lg" : null
      }`}
      onMouseOver={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      <div className="flex justify-between mb-4">
        <span className="text-white">Note</span>{" "}
        {isManager && (
          <>
            {readOnly && noteValue ? (
              hover && (
                <div
                  className="flex items-center space-x-2 cursor-pointer text-blue-navy"
                  onClick={() => setReadOnly(false)}
                >
                  <Image
                    src={`/images/actionIcons/edit-icon.svg`}
                    height={16}
                    width={16}
                  />
                  <span>Edit note</span>
                </div>
              )
            ) : (
              <DataStorageInfo />
            )}
          </>
        )}
      </div>
      {readOnly && noteValue ? (
        <div className="flex flex-col text-gray-lightManatee relative">
          <div className="whitespace-pre-wrap invisible absolute" ref={noteREf}>
            {noteValue}
          </div>
          <div
            className={`whitespace-pre-wrap ${!noteReadMore && "line-clamp-4"}`}
          >
            <Linkify
              options={{ className: "text-blue underline", target: "_blank" }}
            >
              {noteValue}
            </Linkify>
          </div>

          {!fixedNote ? (
            !noteReadMore ? (
              <div
                className="mt-4 flex text-gray-shuttle cursor-pointer"
                onClick={() => readMore()}
              >
                Read more
                <img
                  className="ml-2.5 text-gray-shuttle"
                  src="/images/activity/chevron-down.svg"
                  alt="chevron-down"
                />
              </div>
            ) : (
              <div
                className="mt-4 flex text-gray-shuttle cursor-pointer"
                onClick={() => readMore()}
              >
                Read less
                <img
                  className="ml-2.5 text-gray-shuttle"
                  src="/images/activity/chevron-up.svg"
                  alt="chevron-up"
                />
              </div>
            )
          ) : null}
        </div>
      ) : (
        isManager && (
          <div className="text-white">
            <div className="mb-4 ">
              <TextArea
                placeholder="Start typing..."
                onChange={(e) => setNoteValue(e.target.value)}
                value={noteValue}
              ></TextArea>
            </div>
            <div className="border-b border-gray-steelGrey mb-6 h-0"></div>
            <div className="mb-6 text-yellow-saffron bg-yellow-saffron bg-opacity-20 py-4 px-5 rounded-1.5lg">
              To comply with privacy regulations, please do not enter Personal
              Identifiable Information (PII) of any individual involved in this
              club or investment.
            </div>
            <div className="w-full flex justify-between space-x-4">
              <button
                type="button"
                className={`w-full text-white bg-gray-shuttle rounded-md hover:text-gray-syn1 focus:outline-none p-2 h-12 focus:ring-0`}
                onClick={() => cancelNote()}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={noteValue === note}
                className={`w-full text-black bg-white rounded-md hover:text-gray-syn7 focus:outline-none p-2 h-12 focus:ring-0 ${
                  noteValue === note && "cursor-not-allowed bg-gray-shuttle"
                }`}
                onClick={() => saveNote()}
              >
                Done
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ActivityNote;