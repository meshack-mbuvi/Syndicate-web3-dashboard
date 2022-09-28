import React, { useRef } from 'react';

/**
 * An textarea component with label and icon at the right end
 * If the textarea is disable, the textarea field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */

interface ITextAreaProps {
  id?: string;
  classoverride?: string;
  heightoverride?: string;
  allowResize?: boolean;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  isDisabled?: boolean;
  required?: boolean;
  value?: string;
  rows?: number;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSelect?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<ITextAreaProps> = (props) => {
  const {
    id,
    classoverride,
    heightoverride,
    allowResize = false,
    name,
    onChange,
    // error,
    isDisabled,
    value,
    rows,
    onPaste,
    onKeyUp,
    onSelect,
    ...rest
  } = props;
  const noteTextArea = useRef(null);

  // get number of new lines and multiply by line-height(1.5rem)
  // to get initial height of the text area based on current note value.
  // using 60 to represent the number of words on one line.
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const lines = value.split(/\r\n|\r|\n/).length;
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const linesWithoutNewLines = Math.floor(value.trim().length / 60);
  const totalLines =
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    value.trim().length < 60 ? lines : lines + linesWithoutNewLines;
  const calculatedTextAreaHeight =
    totalLines <= 4 ? `${totalLines * 1.5}rem` : '6rem';

  const autoGrow = () => {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    noteTextArea.current.style.height = '5px';
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    noteTextArea.current.style.height =
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      noteTextArea.current.scrollHeight + 'px';
  };

  return (
    <div className="w-full">
      <textarea
        id={id}
        name={name}
        ref={noteTextArea}
        onChange={(e) => {
          // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
          onChange(e);
        }}
        onInput={() => !heightoverride && autoGrow()}
        onPaste={onPaste}
        onKeyUp={onKeyUp}
        onSelect={onSelect}
        value={value}
        className={`${
          !allowResize && 'resize-none'
        } p-0 m-0 align-bottom text-input-placeholder border-0 border-transparent bg-black text-white rounded-none focus:ring-0 focus:border-transparent w-full leading-6 whitespace-pre-wrap overflow-y-scroll ${classoverride}`}
        {...rest}
        style={{
          height: `${
            heightoverride ? heightoverride : calculatedTextAreaHeight
          }`
        }}
        rows={rows}
        disabled={isDisabled}
      ></textarea>
    </div>
  );
};
