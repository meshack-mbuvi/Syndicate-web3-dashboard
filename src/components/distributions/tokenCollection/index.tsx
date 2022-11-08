import { TokenDetails } from '@/containers/layoutWithSyndicateDetails/activity/shared/TransactionDetails';
import ReactTooltip from 'react-tooltip';

interface Props {
  numberVisible: number;
  tokenDetails: TokenDetails[];
  isAnnotationsModalShown: boolean;
}

export const TokenCollection: React.FC<Props> = ({
  numberVisible,
  tokenDetails,
  isAnnotationsModalShown
}) => {
  return (
    <div
      className={`flex items-center ${
        isAnnotationsModalShown ? '-space-x-2' : ''
      }`}
    >
      {tokenDetails.slice(0, numberVisible).map((token, index) => {
        return (
          <div key={index} className="flex items-center mr-2">
            <div
              key={index}
              className="w-6 h-6 rounded-full mr-2"
              style={{
                backgroundImage: `url('${
                  token.icon ? token.icon : '/images/token.svg'
                }')`,
                backgroundSize: '100%'
              }}
            />{' '}
            {!isAnnotationsModalShown
              ? Number(parseFloat(token.amount).toFixed(4))
              : null}{' '}
            {!isAnnotationsModalShown ? token.symbol : null}
          </div>
        );
      })}
      {tokenDetails.length > numberVisible && (
        <>
          <div
            data-tip
            data-for="tooltip-tokens"
            className="cursor-pointer w-6 h-6 rounded-full bg-white bg-opacity-20 text-center"
            style={{ marginRight: '-0.45rem' }}
          >
            <div className="text-xs font-medium vertically-center">
              +{tokenDetails.length - numberVisible}
            </div>
          </div>
          <div>
            <ReactTooltip
              id="tooltip-tokens"
              place="top"
              effect="solid"
              className="actionsTooltip"
              arrowColor="#222529"
              backgroundColor="#222529"
            >
              <div className="space-y-3">
                {tokenDetails.slice(numberVisible).map((token, index) => {
                  return (
                    <div key={index} className="flex space-x-1.5">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundImage: `url('${
                            token.icon ? token.icon : '/images/token.svg'
                          }')`,
                          backgroundSize: '100%'
                        }}
                      />
                      <div>{token.name}</div>
                    </div>
                  );
                })}
              </div>
            </ReactTooltip>
          </div>
        </>
      )}
    </div>
  );
};
