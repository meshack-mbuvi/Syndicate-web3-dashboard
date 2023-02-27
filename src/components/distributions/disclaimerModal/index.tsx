import { amplitudeLogger, Flow } from '@/components/amplitude';
import { DISTRIBUTION_DISCLAIMER_AGREE } from '@/components/amplitude/eventNames';
import { CTAButton, CTAType } from '@/components/CTAButton';
import { Checkbox } from '@/components/inputs/simpleCheckbox';
import Modal, { ModalStyle } from '@/components/modal';
import { B2, L2 } from '@/components/typography';
import { useState } from 'react';

interface Props {
  isModalVisible: boolean;
  handleModalClose: () => void;
  onClick: () => void;
}

export const DistributionsDisclaimerModal: React.FC<Props> = ({
  isModalVisible,
  handleModalClose,
  onClick
}: Props) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <Modal
      show={isModalVisible}
      closeModal={handleModalClose}
      modalStyle={ModalStyle.DARK}
      customWidth="w-102"
      customClassName="pt-8"
      showHeader={false}
    >
      <div className="m-h-screen">
        <L2 extraClasses="mb-4 px-10">Distributions</L2>
        <div className="mx-10 text-gray-syn4 h-54 dark-scrollbar overflow-y-auto">
          <B2>
            By proceeding, I agree that I reviewed and confirm the following:
            <ul className="list-disc ml-8 mt-2">
              <li>
                Distributions cannot be reversed and may create a taxable event.
              </li>
              <li>
                Distributing proceeds of an asset to members who did not invest
                in that asset (e.g., because they joined the club after the
                investment was made) may have adverse legal and tax consequences
                for club members.
              </li>
              <li>
                If a user’s token holdings change before the distribution
                transaction is confirmed or their token holdings are not
                captured in Syndicate’s system, that user may not receive the
                correct distribution and, in some cases, may not receive a
                distribution at all.
              </li>
              <li>
                I confirm that I have reviewed the distributions and had the
                opportunity to consult with legal, financial, and tax advisors
                within my club’s jurisdiction.
              </li>
            </ul>
          </B2>
        </div>
        <div className="px-10 mb-10 mt-6 space-y-6">
          <div className="flex align-middle space-x-4 text-gray-syn4">
            <B2 extraClasses="py-auto align-middle">
              <Checkbox
                isActive={isActive}
                extraClasses="mb-1"
                onChange={(): void => setIsActive(!isActive)}
              />
            </B2>
            <B2
              extraClasses="cursor-pointer"
              onClick={(): void => setIsActive(!isActive)}
            >
              I understand that distributions are irreversible.
            </B2>
          </div>
          <CTAButton
            onClick={() => {
              onClick();
              amplitudeLogger(DISTRIBUTION_DISCLAIMER_AGREE, {
                flow: Flow.CLUB_DISTRIBUTE
              });
            }}
            disabled={!isActive}
            type={isActive ? CTAType.TRANSACTIONAL : CTAType.DISABLED}
            fullWidth={true}
            extraClasses="mt-6"
          >
            I confirm
          </CTAButton>
        </div>
      </div>
    </Modal>
  );
};
