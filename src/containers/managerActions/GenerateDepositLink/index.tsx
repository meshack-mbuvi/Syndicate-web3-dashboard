import { CTAButton } from '@/components/CTAButton';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { ADMIN_PREPARE_DOCS_CLICK } from '@/components/amplitude/eventNames';
import ArrowDown from '@/components/icons/arrowDown';
import Modal, { ModalStyle } from '@/components/modal';
import CopyLink from '@/components/shared/CopyLink';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { setDepositReadyInfo, setWalletSignature } from '@/state/legalInfo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import Floater from 'react-floater';
import { useDispatch, useSelector } from 'react-redux';
import {
  CopyLinkIcon,
  ExternalLinkColor,
  ExternalLinkIcon,
  RibbonIcon,
  RightArrow
} from 'src/components/iconWrappers';
import { LegalDocumentPreview } from '../shared/legalDocumentPreview';

interface ILinK {
  setShowGenerateLinkModal: Dispatch<SetStateAction<boolean>>;
  showGenerateLinkModal: boolean;
  updateDepositLinkCopyState: () => void;
  showDepositLinkCopyState: boolean;
  syndicateCreationFailed?: boolean;
  showConfettiSuccess?: boolean;
  creatingSyndicate?: boolean;
  syndicateSuccessfullyCreated?: boolean;
  agreementChecked?: boolean;
}

const GenerateDepositLink: FC<ILinK> = ({
  setShowGenerateLinkModal,
  showGenerateLinkModal,
  updateDepositLinkCopyState,
  showDepositLinkCopyState,
  syndicateCreationFailed,
  showConfettiSuccess,
  creatingSyndicate,
  syndicateSuccessfullyCreated,
  agreementChecked
}) => {
  const [copyLinkCTA, setCopyLinkCTA] = useState('border-gray-syn6');
  const {
    legalInfoReducer: {
      depositReadyInfo: { depositLink, adminSigned }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const [open, setOpen] = useState(false);

  const showReviewPage = () => {
    // TODO: navigate to the review page from here.
    return;
  };

  return (
    <>
      {!adminSigned && (
        <>
          {isDemoMode ? (
            <Floater
              content={
                <div className="text-green-volt text-sm">
                  <p>
                    Generate a deposit invite link with the option to include
                    default legal agreements for members to sign.
                  </p>
                  <p className="mt-4">Action disabled in demo mode.</p>
                </div>
              }
              disableHoverToClick
              event="hover"
              eventDelay={0}
              placement="bottom"
              open={open}
              styles={{
                floater: {
                  filter: 'none'
                },
                container: {
                  backgroundColor: '#293300',
                  borderRadius: 5,
                  color: '#fff',
                  filter: 'none',
                  minHeight: 'none',
                  width: 310,
                  padding: 12,
                  textAlign: 'center'
                },
                arrow: {
                  color: '#293300',
                  length: 8,
                  spread: 10
                },
                options: { zIndex: 250 },
                wrapper: {
                  cursor: 'pointer'
                }
              }}
            >
              <button
                className={`bg-green rounded-custom w-full flex items-center justify-center py-4 mb-4 ${
                  isDemoMode ? 'cursor-pointer' : ''
                }`}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div className="flex-grow-1 mr-3">
                  <CopyLinkIcon color="text-black" />
                </div>
                <p className="text-black pr-1 whitespace-nowrap font-whyte-medium sm:text-base text-sm">
                  Generate link to invite members
                </p>
              </button>
            </Floater>
          ) : (
            <button
              className={
                'rounded-custom w-full flex items-center justify-center py-4 mb-4'
              }
              style={{
                backgroundColor: !agreementChecked ? '#3F4147' : '#30E696',
                cursor: !agreementChecked ? 'auto' : 'pointer'
              }}
              onClick={() => setShowGenerateLinkModal(true)}
              disabled={isDemoMode || !agreementChecked}
            >
              <div className="flex-grow-1 mr-3">
                <CopyLinkIcon
                  color={!agreementChecked ? 'text-gray-syn4' : 'text-black'}
                />
              </div>
              <p
                className={
                  'pr-1 whitespace-nowrap font-whyte-medium sm:text-base text-sm'
                }
                style={{ color: !agreementChecked ? '#90949E' : 'black' }}
              >
                Generate link to invite members
              </p>
            </button>
          )}
          {/* Overlay */}
          {open ? (
            <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60" />
          ) : null}
          <div className="flex justify-center w-full mb-4">
            <ArrowDown />
          </div>
        </>
      )}
      {syndicateCreationFailed ? (
        <button
          className="bg-white hover:bg-opacity-90 py-4 w-full rounded-custom text-black"
          onClick={showReviewPage}
        >
          Try again
        </button>
      ) : !showConfettiSuccess ? (
        <CopyLink
          link={depositLink}
          updateCopyState={updateDepositLinkCopyState}
          showCopiedState={showDepositLinkCopyState}
          creatingSyndicate={!adminSigned ? true : creatingSyndicate}
          syndicateSuccessfullyCreated={syndicateSuccessfullyCreated}
          showConfettiSuccess={showConfettiSuccess}
          borderColor={copyLinkCTA}
        />
      ) : null}
      <DepositLinkModal
        setShowGenerateLinkModal={setShowGenerateLinkModal}
        showGenerateLinkModal={showGenerateLinkModal}
        setCopyLinkCTA={setCopyLinkCTA}
      />
    </>
  );
};

interface ILinkModal {
  setShowGenerateLinkModal: Dispatch<SetStateAction<boolean>>;
  showGenerateLinkModal: boolean;
  setCopyLinkCTA?: Dispatch<SetStateAction<string>>;
}

export const DepositLinkModal: FC<ILinkModal> = ({
  setShowGenerateLinkModal,
  showGenerateLinkModal,
  setCopyLinkCTA
}) => {
  const {
    legalInfoReducer: {
      depositReadyInfo: { depositLink }
    },
    erc20TokenSliceReducer: {
      erc20Token: { depositsEnabled }
    }
  } = useSelector((state: AppState) => state);

  const [showAdditionalStep, setShowAdditionalStep] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { clubAddress } = router.query;

  const setDocSigned = () => {
    dispatch(setDepositReadyInfo({ adminSigned: true, depositLink }));
  };

  const startDocumentSigning = (option: string) => {
    if (option === 'no') {
      const legal = JSON.parse(localStorage.getItem('legal') || '{}');
      localStorage.setItem(
        'legal',
        JSON.stringify({
          ...legal,
          [`${clubAddress}`]: { signaturesNeeded: false }
        })
      );
      setShowGenerateLinkModal(false);
      setDocSigned();

      if (setCopyLinkCTA) {
        // change link component border to green momentarily as a call to action
        setCopyLinkCTA('border-green-semantic');
        setTimeout(() => {
          setCopyLinkCTA('border-gray-syn6');
        }, 800);
      }
    } else {
      dispatch(setWalletSignature({ signature: '', timeSigned: new Date() }));
    }
  };

  useEffect(() => {
    const legalData = JSON.parse(localStorage.getItem('legal') || '{}');
    if (legalData[clubAddress as string]) {
      setDocSigned();
    }
  }, [showGenerateLinkModal]);

  const legalDocuments = [
    {
      documentText: 'Default Operating Agreement',
      documentLink:
        'https://docs.google.com/document/d/1rZRBUuUyTmOnMrTP5TwaRiEF11tHskyE'
    },
    {
      documentText: 'Default Subscription Agreement',
      documentLink:
        'https://docs.google.com/document/d/1g2XggEVUGTmdzqHIUHgnjEA6Kld1TmJN'
    }
  ];

  const handleShowAdditionalStep = () => {
    setShowGenerateLinkModal(true);
    setShowAdditionalStep(true);
  };

  return (
    <Modal
      {...{
        modalStyle: ModalStyle.DARK,
        show: showGenerateLinkModal,
        closeModal: () => {
          setShowGenerateLinkModal(false);
          setShowAdditionalStep(false);
        },
        customWidth: 'w-100',
        customClassName: 'pt-8 px-10 pb-5',
        showCloseButton: false,
        outsideOnClick: false,
        showHeader: false,
        alignment: 'align-top',
        margin: 'mt-48'
      }}
    >
      {depositsEnabled && !showAdditionalStep ? (
        <>
          <div className="-mb-1">
            <div className="leading-6">
              Would you like members to sign Operating & Subscription Agreements
              before they deposit?
            </div>
            <div className="text-sm text-gray-syn4 mt-4 mb-6">
              To adapt these legal documents to your needs,{' '}
              <a
                href="https://guide.syndicate.io/en/products/investment-clubs/create-a-legal-entity/legal-document-examples"
                className="text-blue cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>make a copy</span>
              </a>
            </div>
            <div className="space-y-4">
              <div
                className="border-1 border-gray-syn6 hover:border-blue hover:cursor-pointer rounded-1.5lg flex flex-col group"
                onClick={() => handleShowAdditionalStep()}
                onKeyDown={() => ''}
                role="button"
                tabIndex={0}
              >
                <div className="flex justify-between px-8 py-6 items-center leading-3.5 cursor-pointer">
                  <div>
                    <div className="leading-6">
                      Yes, use default LLC agreements
                    </div>
                    <div className="text-sm leading-4 text-gray-syn3 mt-0.5">
                      Requires an existing LLC
                    </div>
                  </div>
                  <RightArrow className="text-gray-syn4 group-hover:text-blue" />
                </div>
                <div className="flex justify-center align-middle rounded-b-1.5lg py-2.5 bg-gray-inactive group-hover:bg-blue">
                  <RibbonIcon
                    className="text-white"
                    height={'0.75rem'}
                    width={'0.75rem'}
                  />
                  <span className="mx-1 text-subtext ">Powered by</span>
                  <img
                    src="/images/latham&watkinsllp.svg"
                    alt="latham & watkins llp logo"
                  />
                </div>
              </div>

              <button
                className="border-1 w-full border-gray-syn6 hover:border-blue cursor-pointer p-8 rounded-1.5lg"
                onClick={() => startDocumentSigning('no')}
              >
                <p className="leading-6 text-left">No</p>
                <p className="text-sm text-left leading-4 text-gray-syn3 mt-0.5">
                  I will handle legal documents separately
                </p>
              </button>
            </div>
          </div>
          <div className="mt-14 mb-6 h-px bg-gray-syn6"></div>
          <p className="px-5 text-gray-syn4 text-sm leading-5.5 text-center pb-2">
            Help me{' '}
            <a
              className="text-blue cursor-pointer"
              href="https://guide.syndicate.io/en/products/investment-clubs/create-a-legal-entity"
              target="_blank"
              rel="noopener noreferrer"
            >
              form a legal entity
            </a>{' '}
            first
          </p>
        </>
      ) : (
        <>
          <div className="pb-5">
            <div className="leading-6 body">
              <p className="flex space-x-4">
                {depositsEnabled ? (
                  <button
                    onClick={() => {
                      setShowAdditionalStep(false);
                      setShowGenerateLinkModal(true);
                    }}
                  >
                    <img src="/images/arrowBack.svg" alt="back" />
                  </button>
                ) : (
                  ''
                )}

                <span>Sign legal agreements</span>
              </p>
            </div>
            <div className="text-sm flex text-gray-syn4 mt-2 mb-6">
              Takes ~5 mins and requires an
              <a
                href="https://guide.syndicate.io/en/products/investment-clubs/create-a-legal-entity"
                className="text-gray-syn4 cursor-pointer ml-1 flex align-middle p-0 space-x-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>existing LLC</span>
                <ExternalLinkIcon iconcolor={ExternalLinkColor.GRAY4} />
              </a>
            </div>

            <div className="space-y-6">
              <div className="border-1 border-gray-syn6 rounded-1.5lg flex flex-col group">
                {legalDocuments.map(({ documentText, documentLink }, index) => (
                  <React.Fragment key={index}>
                    <div className="flex justify-between px-6 py-4 items-center leading-3.5">
                      <LegalDocumentPreview
                        documentLink={documentLink}
                        documentText={documentText}
                      />
                    </div>

                    {index == legalDocuments.length - 1 ? (
                      ''
                    ) : (
                      <div className="mt-2mb-6 h-px bg-gray-syn6"></div>
                    )}
                  </React.Fragment>
                ))}

                <div className="flex justify-center align-middle rounded-b-1.5lg py-2.5 bg-gray-inactive w-full">
                  <RibbonIcon
                    className="text-white"
                    height={'0.75rem'}
                    width={'0.75rem'}
                  />
                  <span className="mx-1 text-subtext">Powered by</span>
                  <img
                    src="/images/latham&watkinsllp.svg"
                    alt="latham & watkins llp logo"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-syn4 mt-4 mb-6">
                To adapt these documents to your needs,{' '}
                <a
                  href="https://guide.syndicate.io/en/products/investment-clubs/create-a-legal-entity/legal-document-examples"
                  className="text-blue cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>make a copy</span>
                </a>
                .<div>You can always handle legal agreements separately.</div>
              </div>

              <Link href={`/clubs/${clubAddress}/manage/legal/prepare`}>
                <CTAButton
                  onClick={() => {
                    if (depositsEnabled) {
                      startDocumentSigning('yes');
                    }
                    amplitudeLogger(ADMIN_PREPARE_DOCS_CLICK, {
                      flow: Flow.CLUB_LEGAL
                    });
                  }}
                >
                  Prepare legal documents
                </CTAButton>
              </Link>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default GenerateDepositLink;
