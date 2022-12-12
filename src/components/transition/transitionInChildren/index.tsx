import { useTimeout } from '@/hooks/useTimeout';
import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  isChildVisible: boolean;
  transitionDurationClassOverride?: string;
  delayMillisecond?: number;
  extraClasses?: string;
}

const TransitionInChildren: FC<Props> = ({
  children,
  isChildVisible,
  transitionDurationClassOverride = 'duration-800',
  delayMillisecond = 0,
  extraClasses
}) => {
  const childRef = useRef<HTMLDivElement>(null);
  const [childHeight, setChildHeight] = useState<number | null>(0);
  const [didRunIntro, setDidRunIntro] = useState(false);

  useTimeout(() => {
    setChildHeight(childRef.current!.getBoundingClientRect().height);
    setDidRunIntro(true);
  }, delayMillisecond);

  // Calculate height + animate-in
  useEffect(() => {
    if (didRunIntro && childRef.current) {
      setChildHeight(childRef.current.getBoundingClientRect().height);
    }
  });

  return (
    <div
      className={`relative ${
        extraClasses ?? ''
      } transition-all ${transitionDurationClassOverride}`}
      style={{
        maxHeight: isChildVisible
          ? childHeight !== null
            ? `${childHeight}px`
            : '100vh'
          : '0',
        opacity: `${isChildVisible ? '1' : '0'}`
      }}
    >
      <div ref={childRef}>{children}</div>
    </div>
  );
};

export default TransitionInChildren;
