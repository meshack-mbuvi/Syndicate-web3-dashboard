import ReactTooltip from 'react-tooltip';

interface Props {
  numberVisible: number;
  tokenDetails: { name: string; symbol: string; icon?: string }[];
}

export const TokenCollection: React.FC<Props> = ({
  numberVisible,
  tokenDetails
}) => {
  return (
    <div className="flex items-center space-x-2">
      {tokenDetails.slice(0, numberVisible).map((token, index) => {
        return (
          <div
            key={index}
            className="w-6 h-6 rounded-full"
            style={{
              backgroundImage: `url('${
                token.icon ? token.icon : '/images/token.svg'
              }')`,
              backgroundSize: '100%'
            }}
          />
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
