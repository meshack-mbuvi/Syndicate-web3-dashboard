import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopiedLinkIcon, CopyToClipboardIcon } from '@/components/iconWrappers';
import {
  TELEGRAM_SHARE_CLICK,
  TWITTER_SHARE_CLICK
} from '../amplitude/eventNames';
import { amplitudeLogger, Flow } from '../amplitude';

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
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    Math.round(Math.random() * (imageOptions.length - 1))
  );
  const [showCopiedState, setShowCopiedState] = useState(false);

  const changeCopiedState = () => {
    setShowCopiedState(true);
    setTimeout(() => setShowCopiedState(false), 1000);
  };

  return (
    <div className="flex flex-col bg-gray-syn7 max-w-104 rounded-custom overflow-hidden">
      {customVisual ? (
        <div className="w-full h-52">{customVisual}</div>
      ) : (
        <div
          className="bg-gray-syn5 h-52 w-full"
          style={{
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            backgroundImage: `url('${imageOptions[randomImageIndex]}')`,
            backgroundSize: 'cover'
          }}
        ></div>
      )}
      <div className="divide-y-2">
        <div className="p-5">{description}</div>
        <div className="p-5 flex justify-between text-gray-syn3 border-gray-syn8">
          <CopyToClipboard text={`${description} ${URL}` as string}>
            <button
              className="flex space-x-2 items-center hover:text-white text-gray-syn3"
              onClick={changeCopiedState}
              onKeyDown={changeCopiedState}
            >
              <div>{showCopiedState ? 'Copied' : 'Copy'}</div>

              <div className="flex items-center">
                {showCopiedState ? (
                  <CopiedLinkIcon color="text-gray-syn3 hover:text-white" />
                ) : (
                  <CopyToClipboardIcon color="text-gray-syn3 hover:text-white" />
                )}
              </div>
            </button>
          </CopyToClipboard>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Share via</span>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${URL}&text=${description}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                amplitudeLogger(TELEGRAM_SHARE_CLICK, {
                  flow: Flow.COLLECTIVE_CLAIM
                });
              }}
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
              onClick={() => {
                amplitudeLogger(TWITTER_SHARE_CLICK, {
                  flow: Flow.COLLECTIVE_CLAIM
                });
              }}
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
