import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

interface Props {
  description: string | any;
  URL?: string;
  imageOptions?: string[];
  customVisual?: any;
}

export const ShareCard: React.FC<Props> = ({
  description,
  URL,
  imageOptions,
  customVisual
}) => {
  const [randomImageIndex] = useState(
    Math.round(Math.random() * (imageOptions.length - 1))
  );

  return (
    <div className="flex flex-col bg-gray-syn7 max-w-104 rounded-custom overflow-hidden">
      {customVisual ? (
        <div className="w-full h-52">{customVisual}</div>
      ) : (
        <div
          className="bg-gray-syn5 h-52 w-full"
          style={{
            backgroundImage: `url('${imageOptions[randomImageIndex]}')`,
            backgroundSize: 'cover'
          }}
        ></div>
      )}
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
            <a
              href={`https://t.me/share/url?url=${URL}&text=${description}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/social/telegram-gray3.svg"
                alt="Telegram icon"
                className="w-5 h-5"
              />
            </a>

            {/* Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${`${description} ${URL}`}`}
              target="_blank"
              rel="noreferrer"
            >
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
