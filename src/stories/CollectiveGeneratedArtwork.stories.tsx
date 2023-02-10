import {
  NFTPreviewer,
  NFTMediaType
} from '@/components/collectives/nftPreviewer';
import { CTAButton } from '@/components/CTAButton';
import { useRef, useState } from 'react';
import Modal from '@/components/modal';
import { CollectivesGeneratedArtwork } from '@/components/collectives/generatedArtwork';
import { elementToImage } from '@/utils/elementToImage';

export default {
  title: 'Experiments/Generated Artwork'
};

const Template = (args: any) => {
  const [artworkURL, setArtworkURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [backgroundColorClass] = useState('bg-red-hal');
  const printRef = useRef<HTMLDivElement>(null);

  const DisplayedArtwork = (
    <CollectivesGeneratedArtwork
      label={args.label}
      backgroundColorClass={backgroundColorClass}
      customId="particles-js-1"
    />
  );

  const CaptureArtwork = (
    <CollectivesGeneratedArtwork
      label={args.label}
      backgroundColorClass={backgroundColorClass}
      customId="particles-js-0"
    />
  );

  return (
    <>
      <div className="opacity-0 pointer-events-none fixed">
        <div ref={printRef} className="w-102 h-102 bg-blue mb-4">
          {CaptureArtwork}
        </div>
      </div>
      <div className="space-y-5 w-fit-content">
        <div className="flex space-x-2">
          <CTAButton
            onClick={async () => {
              try {
                const stringy = await elementToImage(printRef, 2);
                setArtworkURL(stringy);
                setShowModal(true);
              } catch (error) {
                // add error handling
                console.error(error);
              }
            }}
          >
            Screenshot
          </CTAButton>
        </div>
        <hr className="border-gray-syn6" />
        <NFTPreviewer
          {...args}
          name={args.label}
          symbol="ABP"
          description="Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag coloring book cornhole. Portland fixie forage selvage, disrupt +1 dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut put a bird on it asymmetrical, gastropub master cleanse fingerstache succulents swag flexitarian bespoke thundercats kickstarter chartreuse."
          loading={{ name: false, description: false }}
          mediaType={NFTMediaType.CUSTOM}
          mediaSource={DisplayedArtwork}
        />
      </div>
      <Modal
        show={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
      >
        <>
          <div
            className="w-80 h-80"
            style={{
              backgroundImage: `url('${artworkURL}')`,
              backgroundPosition: 'center',
              backgroundSize: '100%',
              backgroundRepeat: 'no-repeat'
            }}
          />
          {artworkURL}
        </>
      </Modal>
    </>
  );
};

export const Image = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Image.args = {
  label: 'My label',
  chromatic: { disableSnapshot: true }
};
