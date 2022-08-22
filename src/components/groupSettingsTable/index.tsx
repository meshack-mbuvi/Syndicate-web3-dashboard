import {
  EditButton,
  SubmitContent
} from '@/components/collectives/edit/editables';
import { useRef, Dispatch, SetStateAction } from 'react';
import { B2, B3, H3 } from '../typography';
import { useDispatch } from 'react-redux';
import { setActiveRowIdx } from '@/state/collectiveDetails/index';
interface Props {
  title: string;
  subtitle?: string;
  rows: {
    title: string | React.ReactNode;
    value: string | React.ReactNode;
    edit: {
      isEditable: boolean;
      inputWithPreview?: boolean;

      inputField?: React.ReactNode;
      rowIndex?: number;
      showCallout?: boolean;
    };
  }[];
  extraClasses?: string;
  showForm?: boolean;
  activeRow?: number;
  setActiveRow?: Dispatch<SetStateAction<number>>;
  editGroupFieldClicked?: boolean;
  setEditGroupFieldClicked?: Dispatch<SetStateAction<boolean>>;
  handleDisclaimerConfirmation?: () => void;
  cancelEdit?: any;
}

export const GroupSettingsTable: React.FC<Props> = ({
  title,
  rows,
  subtitle,
  extraClasses = '',
  activeRow,
  setActiveRow,
  editGroupFieldClicked,
  setEditGroupFieldClicked,
  handleDisclaimerConfirmation,
  cancelEdit
}) => {
  const rowsRef = useRef<HTMLInputElement>();
  const editRef = useRef<HTMLInputElement>();
  const transitionSettings = 'transition-all duration-700';

  const dispatch = useDispatch();

  return (
    <>
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
        </div>

        {/* Divider */}
        <hr className="border-gray-syn7" />

        {/* Rows */}
        <div
          ref={rowsRef}
          className={`space-y-10 transition-all duration-500 overflow-hidden ${extraClasses}`}
        >
          {rows.map((row, index) => {
            const {
              edit: {
                isEditable,
                rowIndex,
                inputField
                // showCallout,
                // inputWithPreview
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
                {editGroupFieldClicked && activeRow === rowIndex ? (
                  <div
                    className={`xl:mr-0 ${
                      editGroupFieldClicked ? 'sm:col-span-8' : 'sm:col-span-6'
                    } xl:mr-0 flex space-x-3 items-center text-white`}
                    ref={editRef}
                  >
                    <div className="w-full flex flex-col space-y-6">
                      {inputField}
                    </div>
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
                            setEditGroupFieldClicked(true);
                          }}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {editGroupFieldClicked ? (
            <div className="flex flex-col sm:grid sm:grid-cols-12 sm:gap-5 group">
              <div className="sm:col-span-4 text-gray-syn4 flex-shrink-0" />
              <div className="sm:col-span-8 xl:mr-0 flex">
                <SubmitContent
                  handleEdit={handleDisclaimerConfirmation}
                  cancelEdit={() => {
                    setActiveRow(0);
                    dispatch(setActiveRowIdx(0));
                    setEditGroupFieldClicked(false);
                    cancelEdit();
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
