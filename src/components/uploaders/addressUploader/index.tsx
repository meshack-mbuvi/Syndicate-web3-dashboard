import { TextArea } from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal/ActivityNote/textArea';
import { AppState } from '@/state';
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InfoActionWrapper } from '../../infoActionWrapper';
import { FileUploader } from '../fileUploader';
import * as XLSX from 'xlsx';
import { setMembershipAddresses } from '@/state/createInvestmentClub/slice';

interface Props {
  title?: string;
  helperText?: string;
  textInputValue: any;
  handleTextInputChange: (e: any) => void;
  customClasses?: string;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSelect?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setProgressPercent: Dispatch<SetStateAction<number>>;
  setRawMemberAddresses: Dispatch<SetStateAction<string[]>>;
  progressPercent: number;
}

export const AddressUploader: React.FC<Props> = ({
  title,
  helperText,
  textInputValue,
  handleTextInputChange,
  customClasses,
  onPaste,
  onKeyUp,
  onSelect,
  progressPercent,
  setProgressPercent,
  setRawMemberAddresses
}) => {
  const {
    createInvestmentClubSliceReducer: { membershipAddresses, errors },
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploadMethodSpreadsheet, setIsUploadMethodSpreadsheet] =
    useState(false);
  const [fileName, setFileName] = useState('');
  const height = 'h-52'; // 13rem
  const dispatch = useDispatch();

  const handleUploadEvent = (event: any) => {
    switch (event.type) {
      case 'loadstart':
        setProgressPercent(10);
        break;
      case 'progress':
        setProgressPercent(50);
        break;
      case 'load':
        setProgressPercent(80);
        break;
      case 'loadend':
        setProgressPercent(90);
        break;
      default:
        setProgressPercent(0);
        break;
    }
  };

  // adding event listener to file reader to track upload progress
  const addUploaderListeners = (reader: any) => {
    reader.addEventListener('loadstart', handleUploadEvent);
    reader.addEventListener('load', handleUploadEvent);
    reader.addEventListener('loadend', handleUploadEvent);
    reader.addEventListener('progress', handleUploadEvent);
    reader.addEventListener('error', handleUploadEvent);
    reader.addEventListener('abort', handleUploadEvent);
  };

  // removing event listeners
  const removeUploaderListeners = (reader: any) => {
    reader.removeEventListener('loadstart', handleUploadEvent);
    reader.removeEventListener('load', handleUploadEvent);
    reader.removeEventListener('loadend', handleUploadEvent);
    reader.removeEventListener('progress', handleUploadEvent);
    reader.removeEventListener('error', handleUploadEvent);
    reader.removeEventListener('abort', handleUploadEvent);
  };

  /* file upload functions */
  const fileReader = new FileReader();

  const csvFileToArray = (string: any) => {
    // csv file rows can be separated by carriage return and new line or just a new line.
    // excel files rows are separated by new lines.
    const rows = string.split(/\r\n|\r|\n/);

    const addressesArray = rows?.reduce((accumulator: any, value: any) => {
      // check if address is valid
      // the check for manager account will be done at the review stage
      const firstColumnAddress = value.split(',')[0];
      if (
        web3.utils.isAddress(firstColumnAddress) ||
        firstColumnAddress.indexOf('.eth') > 0
      ) {
        accumulator.push(firstColumnAddress);
      }

      return accumulator;
    }, []);

    // getting unique addresses only
    const memberAddresses: string[] = [...new Set(addressesArray)] as string[];
    setRawMemberAddresses(memberAddresses);
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
      addUploaderListeners(fileReader);

      const isCsvFile = file.name.endsWith('.csv');
      const isSpreadsheetFile =
        file.name.endsWith('.xls') || file.name.endsWith('.xlsx');

      fileReader.onload = function (event) {
        const text = event?.target?.result;

        // for spreadsheets
        const workbook = XLSX.read(text, { type: 'binary' });
        const worksheetName = workbook.SheetNames[0];
        const workSheetData = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_csv(workSheetData);

        if (isCsvFile) {
          csvFileToArray(text);
        } else if (isSpreadsheetFile) {
          csvFileToArray(data);
        }
      };

      // calling these from within the onLoad function will not work
      // hence the repeated condition here.
      if (isCsvFile) {
        fileReader.readAsText(file);
      } else if (isSpreadsheetFile) {
        fileReader.readAsBinaryString(file);
      }
    }

    // file input will cache the last uploaded file.
    // clearing input value here to make it possible to upload the same file multiple times.
    e.target.value = '';
  };

  // cancellation of upload
  const handleCancelUpload = () => {
    setFileName('');
    setProgressPercent(0);
    dispatch(setMembershipAddresses([]));
  };

  useEffect(() => {
    return removeUploaderListeners(fileReader);
  }, [fileReader]);

  return (
    <InfoActionWrapper
      title={title}
      actionButtonLabel={
        isUploadMethodSpreadsheet ? 'Enter addresses' : 'Upload a spreadsheet'
      }
      helperText={helperText}
      customClasses={`${customClasses}`}
      handleAction={() => {
        setIsUploadMethodSpreadsheet(!isUploadMethodSpreadsheet);
      }}
      errors={errors.memberAddresses} // TODO: make dynamic to support file upload errors
      validAddressCount={membershipAddresses.length}
    >
      <button
        className={`${height} relative w-full ${
          isUploadMethodSpreadsheet ? '' : ''
        } ${isDraggingOver && 'bg-gray-syn8'}`}
        style={{ borderRadius: '0.3125rem' }}
        onDragOver={() => {
          setIsDraggingOver(true);
        }}
        onDragLeave={() => {
          setIsDraggingOver(false);
        }}
      >
        {/* Write addresses as text */}
        <div className={`h-full ${isUploadMethodSpreadsheet && 'hidden'}`}>
          {' '}
          {/* use this div to avoid button's default vertical centering of content */}
          <TextArea
            value={textInputValue}
            onChange={handleTextInputChange}
            heightoverride="13rem"
            classoverride="p-6 border border-gray-syn6 hover:border-gray-syn3 focus:border-blue rounded no-scroll-bar"
            placeholder="0x... , 0x... , 0x... , example.eth"
            name="member-addresses"
            {...{
              onPaste,
              onKeyUp,
              onSelect
            }}
          />
        </div>

        {/* Upload addresses in spreadsheet */}
        <FileUploader
          fileName={fileName}
          successText={`${membershipAddresses.length} ${
            membershipAddresses.length === 1 ? 'address' : 'addresses'
          }`}
          progressPercent={progressPercent}
          promptTitle={'Upload a spreadsheet'}
          promptSubtitle={
            'CSV, XLS, or PDF file with addresses in first column'
          }
          handleUpload={handleFileUpload}
          handleCancelUpload={handleCancelUpload}
          customClasses={`${!isUploadMethodSpreadsheet && 'hidden'}`}
        />
      </button>
    </InfoActionWrapper>
  );
};
