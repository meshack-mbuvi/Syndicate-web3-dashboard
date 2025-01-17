import {
  EditButton,
  SubmitContent
} from '@/components/collectives/edit/editables';
import useWindowSize from '@/hooks/useWindowSize';
import { setActiveRowIdx } from '@/state/modifyCollectiveSettings/index';
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { Switch, SwitchType } from '../switch';
import { B2, B3, H3 } from '../typography';

const transitionSettings = 'transition-all duration-700';

interface Props {
  title: string | ReactElement;
  subtitle?: string;
  isExpandable?: boolean;
  rows: {
    title: string | React.ReactNode;
    value: string | React.ReactNode;
    edit: {
      isEditable: boolean;
      inputWithPreview?: boolean;
      handleDisclaimerConfirmation?: () => void;
      inputField?: React.ReactNode;
      rowIndex?: number;
      showCallout?: boolean;
    };
  }[];
  expander: {
    isExpanded?: boolean;
    isExpandable?: boolean;
    showSubmitCTA?: boolean;
    setIsExpanded?: Dispatch<SetStateAction<boolean>>;
  };
  activeRow: number;
  setActiveRow: (arg: number) => void;
  extraClasses?: string;
  showForm?: boolean;
  setEditGroupFieldClicked?: (arg: boolean) => void;
  handleDisclaimerConfirmation?: () => void;
  cancelEdit?: () => void;
  switchRowIndex?: number;
  isSubmitDisabled?: boolean;
  disableHeightUpdate?: boolean;
  isTableHighlightingActive?: boolean;
  topRowDetails?: React.ReactNode;
}

export const CollapsibleTable: React.FC<Props> = ({
  title,
  rows,
  subtitle,
  activeRow,
  setActiveRow,
  extraClasses = '',
  setEditGroupFieldClicked,
  handleDisclaimerConfirmation,
  expander: {
    isExpandable = true,
    isExpanded = true,
    setIsExpanded,
    showSubmitCTA
  },
  cancelEdit,
  switchRowIndex,
  isSubmitDisabled,
  disableHeightUpdate = false,
  isTableHighlightingActive = true,
  topRowDetails
}) => {
  const rowsRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const [maxHeight, setMaxHeight] = useState('100vh');

  const windowWidth = useWindowSize().width;

  const dispatch = useDispatch();

  const updateMaxHeight = () => {
    if (isExpanded && rowsRef) {
      const rowsHeight = rowsRef.current
        ? rowsRef.current.getBoundingClientRect().height
        : 0;
      const editHeight = editRef.current
        ? editRef.current.getBoundingClientRect().height
        : 0;
      if (rowsHeight && editHeight) {
        setMaxHeight(`${rowsHeight + editHeight}px`);
      } else {
        setMaxHeight(`${rowsHeight}px`);
      }
    }
  };

  useEffect(() => {
    if (disableHeightUpdate) return;
    updateMaxHeight();
  }, [windowWidth, activeRow, disableHeightUpdate]);

  return (
    <div className="space-y-8">
      {/* Top row */}
      <div
        className={`flex justify-between items-center ${
          isTableHighlightingActive && activeRow ? 'opacity-50' : ''
        }`}
      >
        <div className="flex flex-col">
          <H3>{title}</H3>
          {subtitle && <B3 extraClasses="text-gray-syn4">{subtitle}</B3>}
          {topRowDetails && <>{topRowDetails}</>}
        </div>
        {isExpandable && (
          <Switch
            isOn={isExpanded}
            type={SwitchType.EXPLICIT}
            extraClasses="flex-shrink-0"
            onClick={() => {
              // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
              setActiveRow(showSubmitCTA ? 0 : switchRowIndex);
              if (isTableHighlightingActive) {
                // @ts-expect-error TS(2345): Argument of type 'number | undefined' is not assig... Remove this comment to see the full error message
                dispatch(setActiveRowIdx(showSubmitCTA ? 0 : switchRowIndex));
              }
              // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
              setIsExpanded(!isExpanded);
              setEditGroupFieldClicked && setEditGroupFieldClicked(false);
            }}
          />
        )}
      </div>
      {showSubmitCTA && (
        <SubmitContent
          // @ts-expect-error TS(2322): Type '(() => void) | undefined' is not assignable ... Remove this comment to see the full error message
          handleEdit={handleDisclaimerConfirmation}
          cancelEdit={(): void => {
            cancelEdit?.();
            setActiveRow(0);
            dispatch(setActiveRowIdx(0));
          }}
        />
      )}

      {/* Divider */}
      <hr className="border-gray-syn7" />

      {/* Rows */}
      <div
        ref={rowsRef}
        className={`space-y-10 transition-all duration-500 overflow-hidden ${
          isExpanded ? '' : 'hidden'
        } ${extraClasses}`}
        style={{
          maxHeight: `${
            disableHeightUpdate ? '100%' : isExpanded ? maxHeight : '0px'
          }`,
          opacity: `${isExpanded || !isTableHighlightingActive ? '100' : '0'}`
        }}
      >
        {rows.map((row, index) => {
          const {
            edit: {
              isEditable,
              rowIndex,
              handleDisclaimerConfirmation,
              inputField,
              showCallout,
              inputWithPreview
            }
          } = row;

          return (
            <div
              key={index}
              className={`flex flex-col sm:grid sm:grid-cols-12 sm:gap-5 group ${
                isTableHighlightingActive && activeRow && activeRow !== rowIndex
                  ? 'opacity-50'
                  : 'opacity-100'
              } ${transitionSettings}`}
            >
              <B2 className="sm:col-span-4 text-gray-syn4 flex-shrink-0">
                {row.title}
              </B2>
              {(inputWithPreview && activeRow === rowIndex) ||
              (isEditable && activeRow === rowIndex) ? (
                <div
                  className={`xl:mr-0 ${
                    inputWithPreview ? 'sm:col-span-6' : 'sm:col-span-8'
                  }`}
                  ref={editRef}
                >
                  {inputField}
                  <SubmitContent
                    showCallout={showCallout}
                    isSubmitDisabled={isSubmitDisabled}
                    // @ts-expect-error TS(2322): Type '(() => void) | undefined' is not assignable ... Remove this comment to see the full error message
                    handleEdit={handleDisclaimerConfirmation}
                    cancelEdit={(): void => {
                      cancelEdit?.();
                      setActiveRow(0);
                    }}
                  />
                </div>
              ) : (
                <>
                  <B2
                    extraClasses={`sm:col-span-6 xl:mr-0 flex space-x-3 items-center ${
                      isEditable ? 'text-white' : 'text-gray-syn4'
                    }`}
                  >
                    <div className="flex w-full">{row.value}</div>
                  </B2>
                  <div className="sm:col-span-2 flex justify-end">
                    {isEditable && (
                      <EditButton
                        handleClick={() => {
                          // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefined'.
                          setActiveRow(rowIndex);
                          setEditGroupFieldClicked &&
                            setEditGroupFieldClicked(false);
                          // @ts-expect-error TS(2345): Argument of type 'number | undefined' is not assig... Remove this comment to see the full error message
                          dispatch(setActiveRowIdx(rowIndex));
                        }}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
