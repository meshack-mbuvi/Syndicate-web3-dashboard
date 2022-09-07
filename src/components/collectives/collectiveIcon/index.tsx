import { TokenMediaType } from '@/state/collectives/types';

interface Props {
  tokenMedia: string;
  tokenMediaType: string;
}

export const CollectiveIcon: React.FC<Props> = (args) => {
  const { tokenMedia, tokenMediaType } = args;
  return (
    <div>
      <div className="hidden sm:block sm:mr-4 w-10 h-10 rounded-xl">
        {tokenMediaType === TokenMediaType.ANIMATION && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            autoPlay
            playsInline={true}
            loop
            muted={true}
            className={`${'object-cover'} rounded-xl w-full h-full bg-gray-syn6 flex-shrink-0`}
          >
            <source src={tokenMedia} type="video/mp4"></source>
          </video>
        )}
        {tokenMediaType === TokenMediaType.IMAGE && (
          <div
            className="rounded-xl w-full h-full bg-gray-syn6 flex-shrink-0"
            style={{
              backgroundImage: `url(${tokenMedia})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
