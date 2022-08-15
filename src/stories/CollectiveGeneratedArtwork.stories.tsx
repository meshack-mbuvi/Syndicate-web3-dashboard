import {
  NFTPreviewer,
  NFTMediaType
} from '@/components/collectives/nftPreviewer';
import { CtaButton } from '@/components/CTAButton';
import { useRef, useState } from 'react';
import Modal from '@/components/modal';
import { CollectivesGeneratedArtwork } from '@/components/collectives/generatedArtwork';
import { elementToImage } from '@/utils/elementToImage';

export default {
  title: 'Testing/Generated Artwork'
};

const Template = (args) => {
  const [artworkURL, setArtworkURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [backgroundColorClass] = useState('bg-red-hal');
  const printRef = useRef(null);

  const DisplayedArtwork = (
    <CollectivesGeneratedArtwork
      label={args.label}
      backgroundColorClass={backgroundColorClass}
      isForDisplay={true}
    />
  );

  const CaptureArtwork = (
    <CollectivesGeneratedArtwork
      label={args.label}
      backgroundColorClass={backgroundColorClass}
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
          <CtaButton
            onClick={() => {
              elementToImage(printRef, 2, (imageURI) => {
                setArtworkURL(imageURI);
                setShowModal(true);
                console.log(imageURI);
              });
            }}
          >
            Screenshot
          </CtaButton>
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
Image.args = {
  label: 'My label'
};
