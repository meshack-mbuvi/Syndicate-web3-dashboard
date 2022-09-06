import BackButton from '@/components/buttons/BackButton';
import { CollapsibleTable } from '@/components/collapsibleTable/index';
import { CollapsibleTableNoContractInteraction } from '@/components/collapsibleTable/noContractInteraction';
import { GroupSettingsTable } from '@/components/groupSettingsTable';
import { T5, H4 } from '@/components/typography';
import ReactTooltip from 'react-tooltip';
import { NFTPreviewer, NFTMediaType } from '../nftPreviewer';
import { CopyText } from './editables';
import { InputField } from '@/components/inputs/inputField';
import { TextArea } from '@/components/inputs/simpleTextArea';
import { getFormattedDateTimeWithTZ } from '@/utils/dateUtils';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import { useRouter } from 'next/router';
import {
  setMintPrice,
  setMaxPerWallet,
  setIsTransferable,
  setIsCollectiveOpen,
  setMetadataCid,
  setUpdateEnded,
  setOpenUntil,
  setMaxSupply,
  setMintEndTime
} from '@/state/collectiveDetails';
import EditCollectiveMintTime from './EditCollectiveMintTime';
import EditMaxSupply from './EditMaxSupply';
import { useState, useEffect } from 'react';
import {
  FileUploader,
  UploaderProgressType
} from '@/components/uploaders/fileUploader';
import { ChangeSettingsDisclaimerModal } from '@/components/collectives/changeSettingsDisclaimerModal/index';
import { ProgressState } from '@/components/progressCard';
import { ProgressModal } from '@/components/progressModal';
import { ExternalLinkColor } from '@/components/iconWrappers';
import useSubmitMetadata from '@/hooks/collectives/create/useSubmitMetadata';
import { setActiveRowIdx } from '@/state/collectiveDetails/index';
import useFetchCollectiveMetadata from '@/hooks/collectives/create/useFetchNftMetadata';
import { SkeletonLoader } from '@/components/skeletonLoader';
import {
  setCollectiveSubmittingToIPFS,
  setIpfsError,
  setCollectiveArtwork
} from '@/state/createCollective/slice';
import { useUpdateState } from '@/hooks/collectives/useCreateCollective';
import {
  OpenUntil,
  RadioButtonsOpenUntil
} from '@/components/collectives/create/inputs/openUntil/radio';
import { EditRowIndex } from '@/state/collectiveDetails/types';
import { numberWithCommas } from '@/utils/formattedNumbers';
import { OpenUntilStepModal } from '@/components/collectives/confirmOpenUntilStepModal';
import {
  ProgressDescriptor,
  ProgressDescriptorState
} from '@/components/progressDescriptor';
import { CtaButton } from '@/components/CTAButton';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  COLLECTIVE_SUBMIT_SETTINGS,
  MANAGE_TRY_AGAIN_CLICK
} from '@/components/amplitude/eventNames';

type step = {
  title: string;
  action: string;
  isInErrorState: boolean;
  status: string;
};

const ModifyCollectiveSettings: React.FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: {
        ethPriceMintModule,
        erc721Collective,
        fixedRenderer,
        maxPerMemberERC721,
        timeRequirements,
        maxTotalSupplyERC721,
        guardMixinManager
      }
    },
    web3Reducer: {
      web3: { activeNetwork, account, web3 }
    },
    collectiveDetailsReducer: {
      details: {
        collectiveName,
        collectiveSymbol,
        createdAt,
        mintPrice,
        maxPerWallet,
        collectiveAddress,
        mintEndTime,
        maxSupply,
        metadataCid,
        isTransferable: existingIsTransferable
      },

      settings: {
        isTransferable,
        isOpen,
        mintPrice: settingsMintPrice,
        maxPerWallet: settingsMaxPerWallet,
        mintEndTime: settingsMintEndTime,
        maxSupply: settingsMaxSupply
      },
      activeRow: activeRowRedux,
      updateEnded
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const router = useRouter();

  const { data: nftMetadata, isLoading: isLoadingNftMetadata } =
    useFetchCollectiveMetadata(metadataCid);

  const { getArtworkType } = useUpdateState();

  const [description, setDescription] = useState(nftMetadata?.description);
  const [artworkState, setArtworkState] = useState({});
  const [artworkTypeState, setArtworkTypeState] = useState(NFTMediaType.CUSTOM);
  const [artworkUrlState, setArtworkUrlState] = useState('');
  const [activeRow, setActiveRow] = useState<number>(0);
  const [showImageUploader, setShowImageUploader] = useState<boolean>(false);
  const [exceededUploadLimit, setExceededUploadLimit] = useState('');
  const [progressPercent, setProgressPercent] = useState<number>(
    artworkUrlState ? 100 : 0
  );
  const [fileName, setFileName] = useState(null);

  const [editGroupFieldClicked, setEditGroupFieldClicked] =
    useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [progressState, setProgressState] = useState<string>('');

  // Modal change settings states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [openUntilSettingsChanged, setOpenUntilSettingsChanged] =
    useState<boolean>(false);
  const [openUntilStepModalVisible, setOpenUntilStepModalVisible] =
    useState<boolean>(false);
  const [steps, setSteps] = useState<step[]>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progressDescriptorTitle, setProgressDescriptorTitle] =
    useState<string>('');
  const [progressDescriptorStatus, setProgressDescriptorStatus] =
    useState<ProgressDescriptorState>(ProgressDescriptorState.PENDING);
  const [progressDescriptorDescription, setProgressDescriptorDescription] =
    useState<string>('');
  // flag to check whether there is pending transaction before closing modal
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);
  const [currentOpenUntilState, setCurrentOpenUntilState] = useState(null);

  const [subfieldEditing, setSubfieldEditing] = useState(false);

  useEffect(() => {
    if (maxSupply === 0) {
      setCurrentOpenUntilState(OpenUntil.FUTURE_DATE);
    } else {
      setCurrentOpenUntilState(OpenUntil.MAX_MEMBERS);
    }
  }, [maxSupply]);

  useEffect(() => {
    const steps = [];
    const tokenDetails = [
      {
        title: `Update setting`,
        isInErrorState: false,
        action: 'update',
        status: ProgressDescriptorState.PENDING
      },
      {
        title: `Apply changes to collective`,
        isInErrorState: false,
        action: 'apply',
        status: ''
      }
    ];

    steps.push(...tokenDetails);

    setSteps(steps);
  }, []);

  useEffect(() => {
    if (!nftMetadata) return;
    nftMetadata?.image == null
      ? setArtworkUrlState(
          `${
            process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
          }/${nftMetadata?.animation_url.replace('ipfs://', '')}`
        )
      : setArtworkUrlState(
          `${
            process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
          }/${nftMetadata?.image.replace('ipfs://', '')}`
        );
    setDescription(nftMetadata?.description);
  }, [nftMetadata]);

  useEffect(() => {
    async function updateURI() {
      try {
        await fixedRenderer.updateTokenURI(
          account,
          collectiveAddress as string,
          metadataCid,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
      } catch (e) {
        console.log(e);
      }
    }
    if (metadataCid && !updateEnded) {
      updateURI();
      setEditGroupFieldClicked(false);
      dispatch(setUpdateEnded(true));
    }
  }, [metadataCid, account, collectiveAddress, fixedRenderer, updateEnded]);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const onTxConfirm = (transactionHash: string) => {
    setActiveRow(0);
    dispatch(setActiveRowIdx(0));
    setSubfieldEditing(false);
    setTransactionHash(transactionHash);
    setProgressState('pending');
    if (openUntilSettingsChanged) {
      setOpenUntilSettingsChanged(false);
      setOpenUntilStepModalVisible(false);
    }
  };

  const onTxReceipt = () => {
    setProgressState('success');
  };

  const onTxFail = () => {
    setProgressState('failure');
  };

  const onSwitchTxConfirm = (transactionHash) => {
    // Update progress state
    setProgressDescriptorTitle(`Updating...`);
    setProgressDescriptorDescription(
      `This could take anywhere from seconds to hours depending on network congestion and the gas fees you set.`
    );
    updateSteps('status', ProgressDescriptorState.PENDING);

    setTransactionHash(transactionHash);
  };

  const onSwitchTxReceipt = () => {
    setOpenUntilStepModalVisible(true);

    if (activeIndex == steps.length - 1) {
      setProgressDescriptorStatus(ProgressDescriptorState.SUCCESS);
      setOpenUntilStepModalVisible(false);
    } else {
      const nextIndex = activeIndex + 1;
      setProgressDescriptorTitle('');
      setActiveIndex(nextIndex);
    }

    setIsTransactionPending(false);
  };

  const onSwitchTxFail = (error?) => {
    setOpenUntilStepModalVisible(true);
    updateSteps('isInErrorState', true);
    updateSteps('status', ProgressDescriptorState.FAILURE);

    // Update progress state
    setProgressDescriptorTitle(`Error updating`);
    if (
      error?.message?.indexOf('Transaction was not mined within 50 blocks') > -1
    ) {
      setProgressDescriptorDescription(
        'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.'
      );
    } else {
      setProgressDescriptorDescription(
        'This could be due to an error approving on the blockchain or gathering approvals if you are using a Gnosis Safe wallet.'
      );
    }

    // User rejected transaction does not have transactionHash
    if (error.code == 4001) {
      setTransactionHash('');
    }

    setProgressDescriptorStatus(ProgressDescriptorState.FAILURE);
    setIsTransactionPending(false);
  };

  const updateSteps = (key, value) => {
    const updatedSteps = steps;
    updatedSteps[activeIndex][`${key}`] = value;
    setSteps(updatedSteps);
  };

  const updateMixin = async () => {
    try {
      setIsTransactionPending(true);
      const mixin = [maxPerMemberERC721.address];

      // switch to time
      if (currentOpenUntilState === OpenUntil.FUTURE_DATE) {
        mixin.push(timeRequirements.address);
      }

      // switch to max supply
      if (currentOpenUntilState === OpenUntil.MAX_MEMBERS) {
        mixin.push(maxTotalSupplyERC721.address);
      }

      await guardMixinManager.updateDefaultMixins(
        account,
        collectiveAddress as string,
        mixin,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
    } catch (error) {
      onSwitchTxFail(error);
    }
  };

  const handleClickAction = async (e) => {
    e.preventDefault();

    updateSteps('status', ProgressDescriptorState.PENDING);
    updateSteps('isInErrorState', false);

    setProgressDescriptorStatus(ProgressDescriptorState.PENDING);
    setProgressDescriptorTitle(`Applying changes...`);

    dispatch(setOpenUntil(currentOpenUntilState));

    await updateMixin();
  };

  const handleDisclaimerConfirmation = (e?) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const clearErrorStepErrorStates = () => {
    const updatedSteps = steps.map((step) => ({
      ...step,
      isInErrorState: false,
      status: ProgressDescriptorState.PENDING
    }));
    setSteps(updatedSteps);
    setProgressDescriptorStatus(ProgressDescriptorState.PENDING);
    setProgressDescriptorTitle('');
    setProgressDescriptorDescription('');
  };

  const handleCloseConfirmModal = () => {
    // should not close modal if there is pending transaction.
    if (isTransactionPending) return;

    setOpenUntilStepModalVisible(false);
    clearErrorStepErrorStates();
  };

  const handleSubfieldEditing = (boolean: boolean) => {
    setSubfieldEditing(boolean);
  };

  const handleOpenCollective = () => {
    dispatch(setIsCollectiveOpen());
  };

  const handleTransferable = () => {
    dispatch(setIsTransferable());
  };

  const handleExit = () => {
    router &&
      router.push(
        `/collectives/${collectiveAddress}${'?chain=' + activeNetwork.network}`
      );
  };

  const handleCancelUpload = () => {
    setArtworkState({});
    setArtworkTypeState(NFTMediaType.CUSTOM);
    setArtworkUrlState('');
    setProgressPercent(0);
    setFileName('');
  };

  const handleFileUpload = async (e) => {
    const fileLimit = 50;
    const fileObject = e.target.files[0];

    if (e.target.files.length) {
      const { mediaType, mediaSource } = getArtworkType(fileObject);
      setArtworkState(fileObject);
      setArtworkTypeState(mediaType);
      setArtworkUrlState(mediaSource);
      setFileName(fileObject.name);
      setExceededUploadLimit(
        fileObject.size / 1024 / 1024 > fileLimit
          ? 'File exceeds size limit of ' + fileLimit + ' MB'
          : ''
      );
      setProgressPercent(100);
    }
  };

  const currentOpenUntilChange = (openUntil: OpenUntil) => {
    setOpenUntilSettingsChanged(!openUntilSettingsChanged);
    setCurrentOpenUntilState(openUntil);
  };

  const beforeMetadataSubmission = () => {
    dispatch(setCollectiveSubmittingToIPFS(true));
  };

  const onIpfsHash = (hash: string) => {
    dispatch(setMetadataCid(hash));
    dispatch(setUpdateEnded(false));
  };

  const onIpfsError = () => {
    dispatch(setIpfsError(true));
  };

  const { submit: submitMetadata } = useSubmitMetadata(
    beforeMetadataSubmission,
    onIpfsHash,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    onIpfsError
  );

  const handleCancelEdit = () => {
    switch (activeRowRedux) {
      case EditRowIndex.ImageDescriptionGroup:
        dispatch(
          setCollectiveArtwork({
            artwork: {},
            artworkType: NFTMediaType.IMAGE,
            artworkUrl: ''
          })
        );
        break;
      case EditRowIndex.MintPrice:
        dispatch(setMintPrice(mintPrice));
        break;
      case EditRowIndex.MaxPerWallet:
        dispatch(setMaxPerWallet(maxPerWallet));
        break;
      case EditRowIndex.OpenUntil:
        if (currentOpenUntilState === OpenUntil.FUTURE_DATE) {
          dispatch(setMintEndTime(settingsMintEndTime));
        }
        if (currentOpenUntilState === OpenUntil.MAX_MEMBERS) {
          dispatch(setMaxSupply(settingsMaxSupply));
        }
        break;
      case EditRowIndex.Transfer:
        dispatch(setIsTransferable());
        break;
      default:
        break;
    }
    dispatch(setActiveRowIdx(0));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsModalVisible(false);
    setProgressState('confirm');
    switch (activeRow) {
      case EditRowIndex.ImageDescriptionGroup:
        if (!fixedRenderer || !collectiveAddress || !web3) return;
        try {
          submitMetadata(
            collectiveName,
            collectiveSymbol,
            description,
            artworkState,
            artworkTypeState,
            artworkUrlState
          );
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Success'
          });
        } catch (error) {
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Failure'
          });
          console.log(error);
        }
        break;
      case EditRowIndex.MintPrice:
        if (
          !ethPriceMintModule ||
          !collectiveAddress ||
          !settingsMintPrice ||
          !web3
        )
          return;
        try {
          await ethPriceMintModule.updatePrice(
            account,
            collectiveAddress as string,
            web3.utils.toWei(settingsMintPrice),
            onTxConfirm,
            onTxReceipt,
            onTxFail
          );
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Success'
          });
        } catch (error) {
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Failure'
          });
          console.log(error);
        }
        break;
      case EditRowIndex.MaxPerWallet:
        if (
          !maxPerMemberERC721 ||
          !collectiveAddress ||
          !settingsMaxPerWallet ||
          !web3
        )
          return;
        try {
          await maxPerMemberERC721.updateMaxPerMember(
            account,
            collectiveAddress as string,
            parseInt(settingsMaxPerWallet),
            onTxConfirm,
            onTxReceipt,
            onTxFail
          );
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Success'
          });
        } catch (error) {
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Failure'
          });
          console.log(error);
        }
        break;
      case EditRowIndex.OpenUntil:
        if (!collectiveAddress || !mintEndTime || !web3) return;
        if (currentOpenUntilState === OpenUntil.FUTURE_DATE) {
          if (openUntilSettingsChanged) {
            setOpenUntilStepModalVisible(true);
            try {
              await timeRequirements.updateTimeRequirements(
                account,
                collectiveAddress as string,
                createdAt,
                Number(mintEndTime),
                onSwitchTxConfirm,
                onSwitchTxReceipt,
                onSwitchTxFail
              );
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Success'
              });
            } catch (error) {
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Failure'
              });
              console.log(error);
            }
          } else {
            try {
              await timeRequirements.updateTimeRequirements(
                account,
                collectiveAddress as string,
                createdAt,
                Number(mintEndTime),
                onTxConfirm,
                onTxReceipt,
                onTxFail
              );
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Success'
              });
            } catch (error) {
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Failure'
              });
              console.log(error);
            }
          }
        }

        if (currentOpenUntilState === OpenUntil.MAX_MEMBERS) {
          if (openUntilSettingsChanged) {
            setOpenUntilStepModalVisible(true);
            try {
              await maxTotalSupplyERC721.updateTotalSupply(
                account,
                collectiveAddress as string,
                maxSupply,
                onSwitchTxConfirm,
                onSwitchTxReceipt,
                onSwitchTxFail
              );
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Success'
              });
            } catch (error) {
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Failure'
              });
              console.log(error);
            }
          } else {
            try {
              await maxTotalSupplyERC721.updateTotalSupply(
                account,
                collectiveAddress as string,
                maxSupply,
                onTxConfirm,
                onTxReceipt,
                onTxFail
              );
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Success'
              });
            } catch (error) {
              amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
                flow: Flow.COLLECTIVE_MANAGE,
                transaction_status: 'Failure'
              });
              console.log(error);
            }
          }
        }
        break;
      case EditRowIndex.Transfer:
        if (!erc721Collective || !collectiveAddress || !web3) return;
        try {
          await erc721Collective.updateTransferGuard(
            account,
            collectiveAddress as string,
            isTransferable,
            onTxConfirm,
            onTxReceipt,
            onTxFail
          );
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Success'
          });
        } catch (error) {
          amplitudeLogger(COLLECTIVE_SUBMIT_SETTINGS, {
            flow: Flow.COLLECTIVE_MANAGE,
            transaction_status: 'Failure'
          });
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  const handleCloseModal = () => {
    amplitudeLogger(MANAGE_TRY_AGAIN_CLICK, {
      flow: Flow.COLLECTIVE_MANAGE
    });
    setProgressState('');
  };

  const progressModalStates = {
    confirm: {
      title: 'Confirm in wallet',
      description: 'Please confirm the changes in your wallet',
      state: ProgressState.CONFIRM,
      buttonLabel: ''
    },
    success: {
      title: 'Settings updated',
      description: (
        <a
          href={
            activeNetwork?.blockExplorer?.baseUrl +
            '/address/' +
            collectiveAddress
          }
          rel="noreferrer"
          target="_blank"
          className={`text-blue-navy etherscanLink flex space-x-2 items-center justify-center`}
        >
          <div>View on {activeNetwork?.blockExplorer?.name}</div>
          <img
            src="/images/externalLinkBlue.svg"
            alt="Etherscan"
            className={`w-4 h-4`}
          />
        </a>
      ),
      state: ProgressState.SUCCESS,
      buttonLabel: 'Back to collective'
    },
    pending: {
      title: 'Approving',
      description: (
        <>
          `This could take anywhere from seconds to hours depending on network
          congestion and gas fees. You can safely leave this page while you
          wait.
          <a
            href={
              activeNetwork?.blockExplorer?.baseUrl +
              '/address/' +
              collectiveAddress
            }
            rel="noreferrer"
            target="_blank"
            className={`text-blue-navy etherscanLink flex space-x-2 items-center justify-center mt-4`}
          >
            <div>View on {activeNetwork?.blockExplorer?.name}</div>
            <img
              src="/images/externalLinkBlue.svg"
              alt="Etherscan"
              className={`w-4 h-4`}
            />
          </a>
        </>
      ),
      state: ProgressState.PENDING,
      buttonLabel: ''
    },
    failure: {
      title: 'Settings were not updated',
      description: (
        <a
          href={
            activeNetwork?.blockExplorer?.baseUrl +
            '/address/' +
            collectiveAddress
          }
          rel="noreferrer"
          target="_blank"
          className={`text-blue-navy etherscanLink flex space-x-2 items-center justify-center`}
        >
          <div>View on {activeNetwork?.blockExplorer?.name}</div>
          <img
            src="/images/externalLinkBlue.svg"
            alt="Etherscan"
            className={`w-4 h-4`}
          />
        </a>
      ),
      state: ProgressState.FAILURE,
      buttonLabel: 'Try again'
    }
  };

  return (
    <div id="ModifyCollectiveSettings">
      <div className="flex justify-between items-center mt-14 space-x-3">
        <div className="space-y-2 sm:w-7/12">
          <div className="flex items-center space-x-6 relative">
            <T5>Customize</T5>
            <div className="absolute top-0">
              {' '}
              <BackButton
                isHidden={isLoadingNftMetadata}
                isSettingsPage={true}
                transform="left-14 top-0"
              />
            </div>
          </div>
          <H4 extraClasses="text-gray-syn4">{collectiveName}</H4>
        </div>
      </div>

      <div className="py-16 transition-all flex flex-col space-y-18">
        {/* Collective NFT */}
        {isLoadingNftMetadata ? (
          <SkeletonLoader width="50vw" height="50vh" />
        ) : (
          <GroupSettingsTable
            title="Collective NFT"
            editGroupFieldClicked={editGroupFieldClicked}
            setEditGroupFieldClicked={setEditGroupFieldClicked}
            handleDisclaimerConfirmation={handleDisclaimerConfirmation}
            cancelEdit={handleCancelEdit}
            rows={[
              {
                title: 'Name',
                value: collectiveName,
                edit: {
                  isEditable: false
                }
              },
              {
                title: 'Token symbol',
                value: collectiveSymbol,
                edit: {
                  isEditable: false
                }
              },
              {
                title: 'Contract address',
                value: <CopyText txt={collectiveAddress} />,
                edit: {
                  isEditable: false
                }
              },
              {
                title: (
                  <>
                    <span
                      className="inline-flex space-x-2"
                      data-tip
                      data-for="tooltip"
                    >
                      <div>IPFS CID</div>
                      <img
                        src="/images/question.svg"
                        alt="Tooltip"
                        className="cursor-pointer"
                      />
                    </span>
                    <ReactTooltip
                      id="tooltip"
                      place="right"
                      effect="solid"
                      className="actionsTooltip __tooltip_override w-76"
                      arrowColor="#232529"
                      backgroundColor="#232529"
                    >
                      The Content Identifier (CID) is a unique
                      <br />
                      identifier of this asset that is generated
                      <br />
                      when it’s uploaded to the IPFS network
                    </ReactTooltip>
                  </>
                ),
                value: <CopyText txt={metadataCid} />,
                edit: {
                  isEditable: false
                }
              },
              {
                title: 'Image',
                value: (
                  <div className="w-full">
                    <NFTPreviewer
                      mediaSource={
                        nftMetadata
                          ? `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${
                              nftMetadata?.image
                                ? nftMetadata?.image.replace('ipfs://', '')
                                : nftMetadata?.animation_url
                                ? nftMetadata?.animation_url.replace(
                                    'ipfs://',
                                    ''
                                  )
                                : null
                            }`
                          : null
                      }
                      loadingMediaSource={isLoadingNftMetadata}
                      mediaType={
                        nftMetadata?.image === null
                          ? NFTMediaType.VIDEO
                          : NFTMediaType.IMAGE
                      }
                      mediaOnly={true}
                      isEditable={true}
                      handleEdit={() => {
                        setShowImageUploader(true);
                        setActiveRow(EditRowIndex.ImageDescriptionGroup);
                        dispatch(
                          setActiveRowIdx(EditRowIndex.ImageDescriptionGroup)
                        );
                        setEditGroupFieldClicked(true);
                      }}
                    />
                  </div>
                ),
                edit: {
                  isEditable: false,
                  inputWithPreview: showImageUploader,
                  showCallout: true,
                  rowIndex: EditRowIndex.ImageDescriptionGroup,
                  inputField: (
                    <div className="space-y-6">
                      <NFTPreviewer
                        mediaSource={
                          artworkUrlState && artworkUrlState !== ''
                            ? artworkUrlState
                            : nftMetadata?.image === null
                            ? `${
                                process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
                              }/${nftMetadata?.animation_url.replace(
                                'ipfs://',
                                ''
                              )}`
                            : `${
                                process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
                              }/${nftMetadata?.image.replace('ipfs://', '')}`
                        }
                        mediaType={
                          nftMetadata?.image === null
                            ? NFTMediaType.VIDEO
                            : NFTMediaType.IMAGE
                        }
                        mediaOnly={true}
                        isEditable={false}
                        description={description}
                        maxWidth="w-full"
                      />
                      <FileUploader
                        progressPercent={progressPercent}
                        fileName={fileName}
                        errorText={exceededUploadLimit}
                        promptTitle="Upload artwork"
                        promptSubtitle="PNG or MP4 allowed"
                        progressDisplayType={UploaderProgressType.SPINNER}
                        handleUpload={handleFileUpload}
                        handleCancelUpload={handleCancelUpload}
                        accept={'.png, .jpg, .jpeg, .gif, .mp4'}
                        heightClass="h-18"
                      />
                    </div>
                  )
                }
              },
              {
                title: 'Description',
                value: nftMetadata?.description,
                edit: {
                  isEditable: true,
                  showCallout: true,
                  rowIndex: EditRowIndex.ImageDescriptionGroup,
                  inputField: (
                    <TextArea
                      value={description}
                      handleValueChange={(e) => setDescription(e)}
                      placeholderLabel="Description about this NFT collection that will be visible everywhere"
                      widthClass="w-full"
                      heightRows={5}
                    />
                  )
                }
              }
            ]}
            {...{ activeRow, setActiveRow }}
          />
        )}
        {/* Open to new members */}
        <CollapsibleTableNoContractInteraction
          title="Open to new members"
          expander={{
            isNotInteractableExpanded: isOpen,
            setIsNotInteractableExpanded: handleOpenCollective,
            subfieldEditing: subfieldEditing,
            setSubfieldEditing: handleSubfieldEditing
          }}
          handleDisclaimerConfirmation={handleDisclaimerConfirmation}
          setEditGroupFieldClicked={setEditGroupFieldClicked}
          cancelEdit={handleCancelEdit}
          rows={[
            {
              title: 'Invitation',
              value: (
                <div className="text-white">
                  Unrestricted&nbsp;
                  <span className="text-gray-syn4">
                    Anyone with the link can join
                  </span>
                </div>
              ),
              edit: {
                isEditable: false
              }
            },
            {
              title: 'Price per NFT',
              value: (
                <div className="flex space-x-2">
                  <img src={activeNetwork.nativeCurrency.logo} alt="" />
                  <span>
                    {settingsMintPrice}&nbsp;
                    {activeNetwork.nativeCurrency.symbol}
                  </span>
                </div>
              ),
              edit: {
                isEditable: true,
                rowIndex: EditRowIndex.MintPrice,
                handleDisclaimerConfirmation,
                inputField: (
                  <InputField
                    value={settingsMintPrice}
                    onChange={(e) => dispatch(setMintPrice(e.target.value))}
                    type="number"
                  />
                )
              }
            },
            {
              title: 'Max per wallet',
              value: settingsMaxPerWallet,
              edit: {
                isEditable: true,
                rowIndex: EditRowIndex.MaxPerWallet,
                handleDisclaimerConfirmation,
                inputField: (
                  <InputField
                    value={settingsMaxPerWallet}
                    onChange={(e) => dispatch(setMaxPerWallet(e.target.value))}
                    type="number"
                  />
                )
              }
            },
            {
              title: 'Open to new members until',
              value:
                currentOpenUntilState === OpenUntil.FUTURE_DATE ? (
                  <div>
                    Future date of{' '}
                    {getFormattedDateTimeWithTZ(+mintEndTime * 1000)
                      .split(' ')
                      .map((item, index, arr) => {
                        return (
                          <span
                            key={index}
                            className={`${
                              index === arr.length - 1 ? 'text-gray-syn4' : ''
                            }`}
                          >
                            {item}{' '}
                          </span>
                        );
                      })}
                  </div>
                ) : currentOpenUntilState === OpenUntil.MAX_MEMBERS ? (
                  <div>
                    Max supply reaches {'  '}
                    {numberWithCommas(maxSupply)}
                  </div>
                ) : null,
              edit: {
                isEditable: true,
                rowIndex: EditRowIndex.OpenUntil,
                handleDisclaimerConfirmation,
                inputField: (
                  <>
                    <RadioButtonsOpenUntil
                      openUntil={currentOpenUntilState}
                      setOpenUntil={currentOpenUntilChange}
                    />
                    {/* A future date */}
                    <div
                      className={`${
                        currentOpenUntilState === 0
                          ? 'max-h-102 md:max-h-68 mt-8 opacity-100'
                          : 'max-h-0 mt-0 opacity-0'
                      } transition-all duration-500 overflow-hidden`}
                    >
                      <EditCollectiveMintTime />
                    </div>
                    {/* A max number of members is reached */}
                    <div
                      className={`md:w-full ${
                        currentOpenUntilState === 1
                          ? 'max-h-68 mt-8 opacity-100'
                          : 'max-h-0 mt-0 opacity-0'
                      } transition-all duration-500 overflow-hidden`}
                    >
                      <EditMaxSupply />
                    </div>
                  </>
                )
              }
            }
          ]}
          {...{ activeRow, setActiveRow }}
        />

        {/* Allow members to transfer */}
        <CollapsibleTable
          title="Allow members to transfer"
          subtitle="Members will be able to transfer the collective NFTs they own"
          rows={[]}
          expander={{
            isExpanded: isTransferable,
            setIsExpanded: handleTransferable,
            showSubmitCTA: isTransferable !== existingIsTransferable
          }}
          handleDisclaimerConfirmation={handleDisclaimerConfirmation}
          setEditGroupFieldClicked={setEditGroupFieldClicked}
          switchRowIndex={EditRowIndex.Transfer}
          cancelEdit={handleCancelEdit}
          {...{ activeRow, setActiveRow }}
        />
      </div>

      {/* initial change settings disclaimer modal when clicking Submit after modifying something */}
      <ChangeSettingsDisclaimerModal
        {...{
          isModalVisible,
          handleModalClose,
          onClick: handleEdit
        }}
      />

      <OpenUntilStepModal
        activeStepIndex={activeIndex}
        isModalVisible={openUntilStepModalVisible}
        steps={steps}
        handleModalClose={handleCloseConfirmModal}
        showCloseButton={false}
        outsideOnClick={false}
      >
        <>
          {steps?.[activeIndex].status !== '' && (
            <ProgressDescriptor
              title={progressDescriptorTitle}
              description={progressDescriptorDescription}
              state={progressDescriptorStatus}
              transactionHash={transactionHash}
            />
          )}

          {steps?.[activeIndex].action === 'apply' &&
            (steps?.[activeIndex].status == '' ||
              steps?.[activeIndex].status ==
                ProgressDescriptorState.FAILURE) && (
              <div className="mt-6">
                <CtaButton onClick={handleClickAction}>Apply changes</CtaButton>
              </div>
            )}
        </>
      </OpenUntilStepModal>

      {/* progress modal that updates state depending on transaction outcome */}
      {progressState && !openUntilSettingsChanged ? (
        <div className="fixed sm:relative bottom-0 left-0 sm:py-auto w-full bg-gray-syn8 text-center sm:rounded-2.5xl">
          <ProgressModal
            {...{
              ...progressModalStates[progressState],
              isVisible: true,
              txHash: transactionHash,
              buttonOnClick:
                progressModalStates[progressState].buttonLabel == 'Try again'
                  ? handleCloseModal
                  : handleExit,
              explorerLinkText: 'View on ',
              iconColor: ExternalLinkColor.BLUE,
              transactionType: 'transaction',
              showCloseButton:
                progressModalStates[progressState].buttonLabel == 'Try again' ||
                progressModalStates[progressState].buttonLabel ==
                  'Back to collective'
                  ? true
                  : false,
              closeModal: handleCloseModal,
              outsideOnClick:
                progressModalStates[progressState].buttonLabel == 'Try again' ||
                progressModalStates[progressState].buttonLabel ==
                  'Back to collective'
                  ? true
                  : false
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ModifyCollectiveSettings;
