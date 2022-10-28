import { Callout, CalloutType } from '@/components/callout';
import { B3, B4 } from '@/components/typography';
import Image from 'next/image';

export const CustomModuleCallout: React.FC = () => {
  return (
    <Callout
      type={CalloutType.WARNING}
      showIcon={false}
      extraClasses="p-4 rounded-2xl mb-3"
    >
      <div className="p-0.5">
        <div className="flex align-items-center mb-2">
          <Image
            src={'/images/syndicateStatusIcons/warning-triangle-yellow.svg'}
            objectFit="contain"
            height={14.5}
            width={16}
          />
          <B3 extraClasses="font-semibold ml-3">
            Exercise caution with custom modules
          </B3>
        </div>
        <B4 extraClasses="mt-1">
          These modules were not all created by Syndicate and have not all been
          verified. They don’t necessarily do what they say they do.
        </B4>
      </div>
    </Callout>
  );
};
