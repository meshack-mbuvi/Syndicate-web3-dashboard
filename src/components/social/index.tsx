import { CopiedLinkIcon, CopyToClipboardIcon } from '@/components/iconWrappers';
import { ReactNode, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { amplitudeLogger, Flow } from '../amplitude';
import {
  SHARE_LINK_COPY,
  TELEGRAM_SHARE_CLICK,
  TWITTER_SHARE_CLICK
} from '../amplitude/eventNames';

interface Props {
  description: string;
  URL?: string;
  imageOptions?: string[];
  customVisual?: ReactNode;
}

export const ShareCard: React.FC<Props> = ({
  description,
  URL,
  imageOptions,
  customVisual
}) => {
  const [randomImageIndex] = useState(
    Math.round(Math.random() * (imageOptions?.length ?? 2 - 1))
  );
  const [showCopiedState, setShowCopiedState] = useState(false);

  const changeCopiedState = (): void => {
    setShowCopiedState(true);
    setTimeout(() => setShowCopiedState(false), 1000);
    void amplitudeLogger(SHARE_LINK_COPY, {
      flow: Flow.UNCATEGORIZED
    });
  };

  return (
    <div className="flex flex-col bg-gray-syn7 max-w-104 rounded-custom overflow-hidden">
      {customVisual ? (
        <div className="w-full h-52 chromatic-ignore">{customVisual}</div>
      ) : (
        <div
          className="bg-gray-syn5 h-52 w-full chromatic-ignore"
          style={{
            backgroundImage: `url('${imageOptions?.[randomImageIndex] ?? ''}')`,
            backgroundSize: 'cover'
          }}
        ></div>
      )}
      <div className="divide-y-2">
        <div className="p-5">{description}</div>
        <div className="p-5 flex justify-between text-gray-syn3 border-gray-syn8">
          <CopyToClipboard text={`${description} ${URL ?? ''}` as string}>
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
              onClick={(): void => {
                void amplitudeLogger(TELEGRAM_SHARE_CLICK, {
                  flow: Flow.UNCATEGORIZED
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
              onClick={(): void => {
                void amplitudeLogger(TWITTER_SHARE_CLICK, {
                  flow: Flow.UNCATEGORIZED
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
