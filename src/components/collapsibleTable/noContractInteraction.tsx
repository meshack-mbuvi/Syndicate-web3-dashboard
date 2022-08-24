import useWindowSize from '@/hooks/useWindowSize';
import {
  EditButton,
  SubmitContent
} from '@/components/collectives/edit/editables';
import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { Switch, SwitchType } from '../switch';
import { B2, B3, H3 } from '../typography';
import { useDispatch } from 'react-redux';
import { setActiveRowIdx } from '@/state/collectiveDetails/index';

const transitionSettings = 'transition-all duration-700';

interface Props {
  title: string;
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
  expander?: {
    isNotInteractableExpanded?: boolean;
    isExpandable?: boolean;
    setIsNotInteractableExpanded?: Dispatch<SetStateAction<boolean>>;
    subfieldEditing?: boolean;
    setSubfieldEditing?: Dispatch<SetStateAction<boolean>>;
  };
  extraClasses?: string;
  showForm?: boolean;
  activeRow?: number;
  setActiveRow?: (arg: number) => void;
  setEditGroupFieldClicked?: (arg: boolean) => void;
  handleDisclaimerConfirmation?: () => void;
  cancelEdit?: any;
  switchRowIndex?: number;
}

export const CollapsibleTableNoContractInteraction: React.FC<Props> = ({
  title,
  rows,
  subtitle,
  extraClasses = '',
  activeRow,
  setActiveRow,
  expander: {
    isExpandable = true,
    isNotInteractableExpanded = true,
    setIsNotInteractableExpanded,
    subfieldEditing,
    setSubfieldEditing
  },
  cancelEdit,
  switchRowIndex,
  setEditGroupFieldClicked
}) => {
  const rowsRef = useRef<HTMLInputElement>();
  const editRef = useRef<HTMLInputElement>();
  const [maxHeight, setMaxHeight] = useState('100vh');

  const windowWidth = useWindowSize().width;

  const dispatch = useDispatch();

  const updateMaxHeight = () => {
    if (rowsRef) {
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
    updateMaxHeight();
  }, [windowWidth, subfieldEditing]);

  return (
    <div className="space-y-8">
      {/* Top row */}
      <div
        className={`flex justify-between items-center ${
          activeRow && 'opacity-50'
        }`}
      >
        <div className="flex flex-col">
          <H3>{title}</H3>
          {subtitle && <B3 extraClasses="text-gray-syn4">{subtitle}</B3>}
        </div>
        {isExpandable && (
          <Switch
            isOn={isNotInteractableExpanded}
            type={SwitchType.EXPLICIT}
            onClick={() => {
              setIsNotInteractableExpanded(!isNotInteractableExpanded);
              setActiveRow(switchRowIndex);
              dispatch(setActiveRowIdx(switchRowIndex));
            }}
          />
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-syn7" />

      {/* Rows */}
      <div
        ref={rowsRef}
        className={`space-y-10 transition-all duration-500 overflow-hidden ${extraClasses}`}
        style={{
          maxHeight: `${isNotInteractableExpanded ? maxHeight : '0px'}`,
          opacity: `${isNotInteractableExpanded ? '100' : '0'}`
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
                activeRow && activeRow !== rowIndex
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
                    handleEdit={handleDisclaimerConfirmation}
                    cancelEdit={() => {
                      cancelEdit();
                      setActiveRow(0);
                      dispatch(setActiveRowIdx(0));
                      setSubfieldEditing(false);
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
                          setActiveRow(rowIndex);
                          dispatch(setActiveRowIdx(rowIndex));
                          setSubfieldEditing(true);
                          setEditGroupFieldClicked(false);
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
