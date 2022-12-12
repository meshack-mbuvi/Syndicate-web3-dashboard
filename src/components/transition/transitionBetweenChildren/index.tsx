import { FC, useRef } from 'react';

export enum TransitionBetweenChildrenType {
  FADE = 'FADE', // Add transparent copies of children to take up space in the flow
  FADE_ABSOLUTE = 'FADE_ABSOLUTE', // Don't add transparent children to take up space in flow
  VERTICAL_MOVE = 'VERTICAL_MOVE'
}

interface Props {
  visibleChildIndex: number;
  children: React.ReactNode[];
  transitionDurationClassOverride?: string;
  transitionType?: TransitionBetweenChildrenType;
  extraClasses?: string;
}

const TransitionBetweenChildren: FC<Props> = ({
  visibleChildIndex,
  children,
  transitionDurationClassOverride = 'duration-800',
  transitionType = TransitionBetweenChildrenType.FADE,
  extraClasses
}) => {
  const childRefs = useRef<HTMLDivElement[]>([]);
  const renderedTabContent = children.map((child, index) => {
    if (
      transitionType === TransitionBetweenChildrenType.FADE ||
      transitionType === TransitionBetweenChildrenType.FADE_ABSOLUTE
    ) {
      return [
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full ${
            index === visibleChildIndex
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          } transition-all ${transitionDurationClassOverride}`}
        >
          {child}
        </div>
      ];
    }
    if (transitionType === TransitionBetweenChildrenType.VERTICAL_MOVE) {
      return [
        <div
          key={index}
          className={`${
            index === visibleChildIndex ? 'h-full' : ''
          } transition-all ease_vertical_move overflow-hidden overflow-y-scroll no-scroll-bar ${transitionDurationClassOverride}`}
          style={{
            maxHeight:
              index === visibleChildIndex
                ? childRefs.current[index]
                  ? `${
                      childRefs.current[index].getBoundingClientRect().height
                    }px`
                  : 'max-h-screen'
                : '0vh'
          }}
        >
          <div
            className={`${
              index === visibleChildIndex
                ? 'translate-y-0 opacity-100 h-full'
                : '-translate-y-full opacity-0 pointer-events-none h-full'
            } ${
              (visibleChildIndex === index + 1 && 'transform') || ''
            } transition-all ease_vertical_move ${transitionDurationClassOverride} w-full`}
            ref={(ref) => {
              if (ref && !childRefs.current.includes(ref)) {
                childRefs.current.push(ref);
              }
            }}
          >
            {child}
          </div>
        </div>
      ];
    }

    return <></>;
  });

  return (
    <div className={`relative ${extraClasses ?? ''}`}>
      {transitionType === TransitionBetweenChildrenType.FADE && (
        <>
          {/* This is for taking up space in the flow */}
          <div className="opacity-0 transition-all">
            {children[visibleChildIndex]}
          </div>

          {/* Children absolutely positioned on top of eachother */}
          {renderedTabContent}
        </>
      )}
      {transitionType === TransitionBetweenChildrenType.FADE_ABSOLUTE && (
        <>
          {/* Children absolutely positioned on top of eachother */}
          {renderedTabContent}
        </>
      )}
      {transitionType === TransitionBetweenChildrenType.VERTICAL_MOVE && (
        <>{renderedTabContent}</>
      )}
    </div>
  );
};

export default TransitionBetweenChildren;
