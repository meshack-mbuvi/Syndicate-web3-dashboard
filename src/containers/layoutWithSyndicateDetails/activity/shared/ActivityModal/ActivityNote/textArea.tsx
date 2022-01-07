import React, { useRef } from "react";

/**
 * An textarea component with label and icon at the right end
 * If the textarea is disable, the textarea field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */

interface ITextAreaProps {
  id?: string;
  classoverride?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  rows?: number;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<ITextAreaProps> = (props) => {
  const { id, name, onChange, error, value, rows, onPaste, onKeyUp, ...rest } =
    props;
  const noteTextArea = useRef(null);

  // get number of new lines and multiply by line-height(1.5rem)
  // to get initial height of the text area based on current note value.
  const lines = value.split(/\r\n|\r|\n/).length;
  const textAreaHeight = `${lines * 1.5}rem`;

  const autoGrow = () => {
    noteTextArea.current.style.height = "5px";
    noteTextArea.current.style.height =
      noteTextArea.current.scrollHeight + "px";
  };

  return (
    <div className="w-full">
      <textarea
        id={id}
        name={name}
        ref={noteTextArea}
        onChange={(e) => {
          onChange(e);
        }}
        onInput={() => autoGrow()}
        onPaste={onPaste}
        onKeyUp={onKeyUp}
        value={value}
        className={`p-0 m-0 align-bottom text-input-placeholder border-0 border-transparent bg-black text-white rounded-none focus:ring-0 focus:border-transparent resize-none w-full leading-6 no-scroll-bar whitespace-pre-wrap`}
        {...rest}
        style={{ height: textAreaHeight }}
        rows={rows}
      ></textarea>
    </div>
  );
};
