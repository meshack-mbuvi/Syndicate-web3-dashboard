import { AnimatedText } from '@/components/animatedText';
import { Callout } from '@/components/callout';
import { CTAButton, CTAType } from '@/components/CTAButton';
import { StepsOutline } from '@/components/stepsOutline';

interface Props {
  gasEstimate: { amount: number; tokenName: string; fiatAmount: number };
}

export const CollectivesCreateOutline: React.FC<Props> = ({ gasEstimate }) => {
  return (
    <div>
      <h2>Form a Collective</h2>
      <div className="text-sm mt-2 text-gray-syn4">
        A social networking primitive, enabling any person and community to
        create powerful on-chain social networks.
      </div>
      <StepsOutline
        activeIndex={0}
        steps={[
          {
            title: 'Launch membership pass',
            description: (
              <div>
                <div>
                  Create & customize an ERC-721 collection that’s as unique as
                  your community, the foundation to your web3 journey
                </div>
                <Callout extraClasses="mt-3 rounded-xl px-3 py-2.5">
                  <div className="flex justify-between space-x-2">
                    <div className="flex flex-grow space-x-3">
                      <img src="/images/fuel-pump-blue.svg" alt="Gas icon" />
                      <div>Estimated gas</div>
                    </div>
                    <div>
                      {gasEstimate.amount} {gasEstimate.tokenName} (~
                      {Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(gasEstimate.fiatAmount)}
                      )
                    </div>
                  </div>
                </Callout>
                <div className="mt-2">
                  Launch <AnimatedText text="unlimited collectives for free" />{' '}
                  on Syndicate. Just pay gas.
                </div>
              </div>
            )
          },
          {
            title: 'Expand your collective',
            description:
              'Send invitations & manage membership as the community grows'
          },
          {
            title: 'Do more than you ever could IRL',
            description:
              'Host exclusive events, invest together, and much more...'
          }
        ]}
        extraClasses="mt-6"
      />
      <CTAButton
        extraClasses="mt-12"
        fullWidth={true}
        type={CTAType.COLLECTIVE}
      >
        Start
      </CTAButton>
      <div className="mt-4 text-sm text-gray-syn4">
        Questions? Contact us at{' '}
        <a href="mailto:support@syndicate.io" className="text-gray-syn3">
          support@syndicate.io
        </a>{' '}
        or on{' '}
        <a href="https://discord.gg/syndicatedao" className="text-gray-syn3">
          Discord
        </a>
      </div>
    </div>
  );
};
