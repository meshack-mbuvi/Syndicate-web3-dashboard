import { Callout, CalloutType } from '@/components/callout';
import IconInfo from '@/components/icons/info';
import TransitionBetweenChildren from '@/components/transitionBetweenChildren';
import { B2, B3, FL } from '@/components/typography';
import useWindowSize from '@/hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';

/**
 * A UI template for review flow steps.
 * @param title The large title above the whole section
 * @param titleSize Options for title sizing
 * @param inputs All inputs and associated data
 * @param activeInputIndex The input that needs extra helper info displayed
 * @param hideCallouts Never show the right column with supplementary info callouts
 * @param isReview Layout for the last create flow step where reviewing all inputted info
 * @param handleCurrentReviewEditingIndex Optional callback for knowing which input is currently being reviewed when isReview is true
 */

interface Props {
  title: string;
  titleSize?: CreateFlowStepTemplateTitleSize;
  inputs: {
    input: React.ReactNode;
    label: string;
    info: string;
    reviewValue?: string | React.ReactNode;
  }[];
  activeInputIndex: number | null;
  hideCallouts?: boolean;
  isReview?: boolean;
  handleCurrentReviewEditingIndex?: (newIndex: number | null) => void;
}

export enum CreateFlowStepTemplateTitleSize {
  H2 = `font-regular text-H2-mobile sm:text-H2`,
  H4 = `font-regular text-H4-mobile sm:text-H4`
}

export const CreateFlowStepTemplate: React.FC<Props> = ({
  title,
  titleSize = CreateFlowStepTemplateTitleSize.H2,
  inputs,
  activeInputIndex = 0,
  hideCallouts = false,
  isReview = false,
  handleCurrentReviewEditingIndex
}) => {
  const windowSize = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef([]);
  const [calloutTopPosition, setCalloutTopPosition] = useState<number>(0);
  const [showCallout, setShowCallout] = useState(false);
  const [hideReviewHoverStyles, setHideReviewHoverStyles] = useState(false);

  const calculateCalloutTopPosition = (input: HTMLDivElement) => {
    const containerTopOffset =
      containerRef.current?.getBoundingClientRect().top;
    const inputHeight = input.getBoundingClientRect().height;
    const inputTop = input.getBoundingClientRect().top;
    const topOffset = inputTop! + inputHeight! / 2;
    return topOffset! - containerTopOffset!;
  };

  const [currentReviewEditingIndex, setCurrentEditingIndex] = useState<
    number | null
  >(null);
  const isInputHidden = (index: number) => {
    // const allInputsAreHidden = currentReviewEditingIndex === null && isReview;
    // return (allInputsAreHidden || !(currentReviewEditingIndex === index))
    if (!isReview) {
      return false;
    } else {
      return !(currentReviewEditingIndex === index);
    }
  };

  // Wait until the first render before calculating the
  // callout position
  useEffect(() => {
    // setShowCallout(true);
    // setCalloutTopPosition(
    //     calculateCalloutTopPosition(inputRefs.current[0])
    // );
    setTimeout(() => {
      setShowCallout(true);
    }, transitionDuration);
  }, []);

  useEffect(() => {
    setCalloutTopPosition(calculateCalloutTopPosition(inputRefs.current[0]));
  }, [showCallout]);

  // When the title size changes, the callout position
  // needs to be recalculated. But since the size transition
  // takes time, we need to delay until it's finished.
  useEffect(() => {
    setTimeout(() => {
      if (activeInputIndex !== null && !isInputHidden(activeInputIndex)) {
        setCalloutTopPosition(
          calculateCalloutTopPosition(inputRefs.current[activeInputIndex])
        );
      }
    }, transitionDuration);
  }, [titleSize]);

  // Calculate callout position when the active input changes
  useEffect(() => {
    const containerTopOffset =
      containerRef.current?.getBoundingClientRect().top;
    const moveCalloutPositionIfNeeded = () => {
      if (
        (activeInputIndex || activeInputIndex === 0) &&
        (containerTopOffset || containerTopOffset === 0) &&
        !isInputHidden(activeInputIndex)
      ) {
        setCalloutTopPosition(
          calculateCalloutTopPosition(inputRefs.current[activeInputIndex])
        );
      }
    };
    if (isReview) {
      setTimeout(() => {
        moveCalloutPositionIfNeeded();
      }, transitionDuration);
    } else {
      moveCalloutPositionIfNeeded();
    }
    setHideReviewHoverStyles(true);
    setTimeout(() => {
      setHideReviewHoverStyles(false);
    }, transitionDuration);
  }, [activeInputIndex, windowSize.width]);

  const transitionDuration = 700;

  return (
    <div
      ref={containerRef}
      className={`flex ${hideCallouts ? 'space-x-0' : 'space-x-24'}`}
    >
      <div
        className={`flex-grow ${
          hideCallouts ? 'w-full' : 'sm:w-1/2'
        } duration-${transitionDuration}`}
      >
        {/* Title */}
        <div
          className={`mb-8 ${titleSize} transform transition-font-size duration-${transitionDuration}`}
        >
          {title}
        </div>

        {/* Inputs */}
        <div className="">
          {inputs.map((input, index) => (
            <div
              key={index}
              className={`relative w-full visibility-container ${
                isReview
                  ? `rounded-2.5xl px-4 -mx-4 ${
                      hideReviewHoverStyles
                        ? ''
                        : 'hover:bg-gray-syn7 hover:py-5 hover:-my-5 hover:px-4 hover:-mx-4'
                    }`
                  : ''
              } my-8 cursor-pointer`}
            >
              <div className="w-full">
                {/* Label */}
                {isReview ? (
                  <B3 extraClasses="text-gray-syn4 mb-2">{input.label}</B3>
                ) : (
                  <FL extraClasses="mb-2.5">{input.label}</FL>
                )}

                {/* Input & review value */}
                <div
                  ref={(ref) => {
                    // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
                    if (ref && !inputRefs.current.includes(ref)) {
                      // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
                      inputRefs.current.push(ref);
                    }
                  }}
                >
                  <TransitionBetweenChildren
                    visibleChildIndex={
                      isReview
                        ? currentReviewEditingIndex === index
                          ? 0
                          : 1
                        : 0
                    }
                    extraClasses="w-full"
                    transitionDurationClassOverride={`duration-${transitionDuration}`}
                  >
                    {input.input}
                    {input.reviewValue}
                  </TransitionBetweenChildren>
                </div>
              </div>

              {/* Edit button (review mode) */}
              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-syn7 px-3 py-2 rounded-full text-right visibility-hover invisible ${
                  !isReview
                    ? 'hidden'
                    : `${hideReviewHoverStyles ? 'opacity-0' : 'opacity-100'}`
                }`}
                onClick={() => {
                  if (currentReviewEditingIndex === index) {
                    setCurrentEditingIndex(null);
                    if (handleCurrentReviewEditingIndex) {
                      handleCurrentReviewEditingIndex(null);
                    }
                  } else {
                    setCurrentEditingIndex(index);
                    if (handleCurrentReviewEditingIndex) {
                      handleCurrentReviewEditingIndex(index);
                    }
                  }
                }}
              >
                <B2 extraClasses="text-blue-neptune">
                  {currentReviewEditingIndex === index ? 'Done' : 'Edit'}
                </B2>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Moving callout */}
      <div
        className={`${
          hideCallouts
            ? 'w-0 h-0 opacity-0 pl-0'
            : 'hidden sm:block w-1/2 opacity-100 pl-12'
        } transition-all duration-${transitionDuration}`}
      >
        <div
          className={`min-w-50 relative transform -translate-y-1/2 ${
            activeInputIndex !== null
              ? `transition-all duration-${transitionDuration}`
              : ''
          } ${
            showCallout
              ? `opacity-100 transition-all duration-${transitionDuration}`
              : 'opacity-0'
          }`}
          style={{
            top: `${calloutTopPosition}px`
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/chevron-divider.svg"
            alt="Chevron divider"
            className="absolute top-1/2 transform -translate-y-1/2 -left-12 bg-opacity-10"
          />
          <Callout
            extraClasses={`relative`}
            type={CalloutType.REGULAR}
            icon={
              <IconInfo
                width={22}
                height={22}
                textColorClass="text-blue-stratosphere"
              />
            }
          >
            <TransitionBetweenChildren
              visibleChildIndex={activeInputIndex ? activeInputIndex : 0}
            >
              {inputs.map((input, index) => (
                <div key={index}>{input.info}</div>
              ))}
            </TransitionBetweenChildren>
          </Callout>
        </div>
      </div>
    </div>
  );
};
