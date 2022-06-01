import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { PillButton, PillButtonStyle } from '../pillButtons';

interface Props {
  description: string | any;
  URL?: string;
  imageOptions: string[];
}

export const ShareCard: React.FC<Props> = ({
  description,
  URL,
  imageOptions
}) => {
  const [randomImageIndex, setRandomImageIndex] = useState(
    Math.round(Math.random() * (imageOptions.length - 1))
  );

  const shuffleImageIndex = () => {
    const newRandomIndex = Math.round(
      Math.random() * (imageOptions.length - 1)
    );
    if (newRandomIndex === randomImageIndex) {
      setRandomImageIndex((newRandomIndex + 1) % imageOptions.length);
    } else {
      setRandomImageIndex(newRandomIndex);
    }
  };

  return (
    <div className="flex flex-col bg-gray-syn7 max-w-104 rounded-custom overflow-hidden">
      <div
        className="bg-gray-syn5 h-52 w-full visibility-container"
        style={{
          backgroundImage: `url('${imageOptions[randomImageIndex]}')`,
          backgroundSize: 'cover'
        }}
      >
        <PillButton
          onClick={() => {
            shuffleImageIndex();
          }}
          style={PillButtonStyle.LIGHT}
          extraClasses="flex space-x-2 horizontally-center vertically-center visibility-hover invisible transition-all"
        >
          <svg
            width="16"
            height="13"
            viewBox="0 0 16 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.384766 10.1117C0.384766 10.5575 0.717494 10.8714 1.19461 10.8714H2.6762C3.79367 10.8714 4.47168 10.5386 5.23131 9.63463L6.65639 7.93959L8.05636 9.60952C8.83482 10.5386 9.60073 10.8777 10.7245 10.8777H11.8419V12.2525C11.8419 12.6292 12.0805 12.8677 12.4634 12.8677C12.633 12.8677 12.7899 12.805 12.9155 12.7045L15.389 10.6454C15.6966 10.3943 15.6903 9.98619 15.389 9.73507L12.9155 7.66964C12.7899 7.56292 12.633 7.50014 12.4634 7.50014C12.0805 7.50014 11.8419 7.7387 11.8419 8.11537V9.34584H10.7559C10.0465 9.34584 9.607 9.11356 9.09222 8.5046L7.63574 6.77818L9.09849 5.0392C9.61956 4.41769 10.0213 4.20424 10.7182 4.20424H11.8419V5.45354C11.8419 5.83022 12.0805 6.06878 12.4634 6.06878C12.633 6.06878 12.7899 6.006 12.9155 5.90555L15.389 3.8464C15.6966 3.59528 15.6903 3.18722 15.389 2.93611L12.9155 0.870675C12.7899 0.763951 12.633 0.701172 12.4634 0.701172C12.0805 0.701172 11.8419 0.939732 11.8419 1.31641V2.67243H10.7307C9.56934 2.67243 8.83482 2.99888 8.01242 3.99079L6.65639 5.60421L5.23131 3.91546C4.47168 3.01144 3.74972 2.67243 2.63225 2.67243H1.19461C0.717494 2.67243 0.384766 2.99261 0.384766 3.43834C0.384766 3.88407 0.723772 4.20424 1.19461 4.20424H2.57575C3.25377 4.20424 3.70578 4.43025 4.22056 5.04548L5.67076 6.7719L4.22056 8.5046C3.6995 9.11984 3.29143 9.34584 2.6197 9.34584H1.19461C0.723772 9.34584 0.384766 9.66602 0.384766 10.1117Z"
              fill="black"
            />
          </svg>
          <div>Shuffle</div>
        </PillButton>
      </div>
      <div className="divide-y-2">
        <div className="p-5">{description}</div>
        <div className="p-5 flex justify-between text-gray-syn3 border-gray-syn8">
          <CopyToClipboard text={`${description} ${URL}` as string}>
            <button className="flex space-x-2 items-center hover:text-white text-gray-syn3">
              <div>Copy</div>
              <img
                src="/images/copy-clipboard-gray3.svg"
                alt="Copy icon"
                className="w-4 h-4"
              />
            </button>
          </CopyToClipboard>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:visible">Share via</span>

            {/* Telegram */}
            <a href={`https://t.me/share/url?url=${URL}&text=${description}`}>
              <img
                src="/images/social/telegram-gray3.svg"
                alt="Telegram icon"
                className="w-5 h-5"
              />
            </a>

            {/* Twitter */}
            <a href={`https://twitter.com/intent/tweet?text=${description}`}>
              <img
                src="/images/social/twitter-gray3.svg"
                alt="Twitter icon"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
