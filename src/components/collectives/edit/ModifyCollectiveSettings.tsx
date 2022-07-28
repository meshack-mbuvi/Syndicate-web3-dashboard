import BackButton from '@/components/buttons/BackButton';
import { CollapsibleTable } from '@/components/collapsibleTable';
import { T5, H4 } from '@/components/typography';
import ReactTooltip from 'react-tooltip';
import { NFTPreviewer, NFTMediaType } from '../nftPreviewer';
import { CopyText } from './editables';
import { InputField } from '@/components/inputs/inputField';
import { TextArea } from '@/components/inputs/simpleTextArea';
import { getFormattedDateTimeWithTZ } from '@/utils/dateUtils';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import {
  setDescription,
  setMintPrice,
  setMaxPerWallet,
  setIsTransferable,
  setIsCollectiveOpen
} from '@/state/collectiveDetails';
import EditCollectiveMintTime from './EditCollectiveMintTime';
import { useState } from 'react';
import {
  FileUploader,
  UploaderProgressType
} from '@/components/uploaders/fileUploader';

const ModifyCollectiveSettings: React.FC = () => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    },
    collectiveDetailsReducer: {
      details: {
        collectiveName,
        collectiveSymbol,
        mintPrice,
        maxPerWallet,
        collectiveAddress,
        mintEndTime,
        ipfsHash,
        description,
        isTransferable: existingIsTransferable,
        isOpen: existingIsOpen
      },
      settings: { isTransferable, isOpen }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const collectiveImage = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${ipfsHash}`;

  const loading = false; // TODO loading state while fetching club info

  const [activeRow, setActiveRow] = useState(0);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const handleOpenCollective = () => {
    dispatch(setIsCollectiveOpen());
  };

  const handleTransferable = () => {
    dispatch(setIsTransferable());
  };

  const handleEdit = () => {
    // TODOs
    // 1. show disclaimer modal before sending transaction to metamask. https://www.figma.com/file/OS60TNEd2YWu9y2jui7NnM/Collectives?node-id=2881%3A44554
    // 2. Show 'Confirm in wallet' modal https://www.figma.com/file/OS60TNEd2YWu9y2jui7NnM/Collectives?node-id=3228%3A42155
    // 3/ Once we get transaction hash from metamask, show 'Approving' modal https://www.figma.com/file/OS60TNEd2YWu9y2jui7NnM/Collectives?node-id=3228%3A42225
    // 4. On success show 'Settings updated' modal https://www.figma.com/file/OS60TNEd2YWu9y2jui7NnM/Collectives?node-id=3228%3A42296
    // 5. On error show 'Settings were not updated' modal https://www.figma.com/file/OS60TNEd2YWu9y2jui7NnM/Collectives?node-id=4747%3A46252
    // NOTE: We don't have UIs for the modal mentioned
    // 👇 example code to update mint price
    // switch (activeRow) {
    //   case EditRowIndex.MintPrice:
    //     if (!ethPriceMintModule || !collectiveAddress || !editField) return;
    //     await ethPriceMintModule.updatePrice(
    //       account,
    //       collectiveAddress as string,
    //       web3.utils.toWei(editField),
    //       onTxConfirm, // Function to handle metamask response with transaction hash
    //       onTxReceipt, // Function to handle when transaction was successful
    //       onTxFail // Function to handle when transaction fails
    //     );
    //     break;
    //   default:
    //     break;
    // }
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
                isHidden={loading}
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
        <CollapsibleTable
          title="Collective NFT"
          expander={{
            isExpandable: false
          }}
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
              value: <CopyText txt={ipfsHash} />,
              edit: {
                isEditable: false
              }
            },
            {
              title: 'Image',
              value: (
                <div className="w-full">
                  <NFTPreviewer
                    mediaSource={collectiveImage}
                    mediaType={NFTMediaType.IMAGE}
                    mediaOnly={true}
                    isEditable={true}
                    handleEdit={() => {
                      setShowImageUploader(true);
                      setActiveRow(EditRowIndex.Image);
                    }}
                  />
                </div>
              ),
              edit: {
                isEditable: false, // Hack to make edit image with preview
                inputWithPreview: showImageUploader,
                showCallout: true,
                rowIndex: EditRowIndex.Image,
                handleEdit,
                inputField: (
                  <div className="w-full flex flex-col space-y-6">
                    <NFTPreviewer
                      mediaSource={collectiveImage}
                      mediaType={NFTMediaType.IMAGE}
                      mediaOnly={true}
                      isEditable={true}
                    />

                    <FileUploader
                      progressPercent={0}
                      fileName={'artwork.png'}
                      successText={'uploaded'}
                      promptTitle="Upload artwork"
                      promptSubtitle="PNG or MP4 allowed"
                      progressDisplayType={UploaderProgressType.SPINNER}
                      handleUpload={() => null}
                      handleCancelUpload={() => null}
                      accept={'.png, .jpg, .jpeg, .gif, .mp4'}
                      heightClass="h-18"
                    />
                  </div>
                )
              }
            },
            {
              title: 'Description',
              value: description,
              edit: {
                isEditable: true,
                showCallout: true,
                rowIndex: EditRowIndex.Description,
                handleEdit,
                inputField: (
                  <TextArea
                    value={description}
                    handleValueChange={(e) => dispatch(setDescription(e))}
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

        {/* Open to new members */}
        <CollapsibleTable
          title="Open to new members"
          expander={{
            isExpanded: isOpen,
            setIsExpanded: handleOpenCollective,
            showSubmitCTA: isOpen !== existingIsOpen
          }}
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
                  <img src="/images/chains/ethereum.svg" alt="" />
                  <span>
                    {mintPrice}&nbsp;{activeNetwork.nativeCurrency.symbol}
                  </span>
                </div>
              ),
              edit: {
                isEditable: true,
                rowIndex: EditRowIndex.MintPrice,
                handleEdit,
                inputField: (
                  <InputField
                    value={mintPrice}
                    onChange={(e) => dispatch(setMintPrice(e.target.value))}
                    type="number"
                  />
                )
              }
            },
            {
              title: 'Max per wallet',
              value: maxPerWallet,
              edit: {
                isEditable: true,
                rowIndex: EditRowIndex.MaxPerWallet,
                handleEdit,
                inputField: (
                  <InputField
                    value={maxPerWallet}
                    onChange={(e) => dispatch(setMaxPerWallet(e.target.value))}
                    type="number"
                  />
                )
              }
            },
            {
              title: 'Open to new members until',
              value: (
                <div>
                  Future date:{' '}
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
              ),
              edit: {
                isEditable: true,
                rowIndex: EditRowIndex.Time,
                handleEdit,
                inputField: <EditCollectiveMintTime />
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
          {...{ activeRow, setActiveRow }}
        />
      </div>
    </div>
  );
};

export default ModifyCollectiveSettings;

enum EditRowIndex {
  Default,
  Image,
  Description,
  Time,
  MaxPerWallet,
  MintPrice
}
