import React from 'react';

/** skeleton loader component
 * used to show component loading states when a single component is involved.
 * @param width the width for the loader
 * @param height the height of the loader
 */
interface SkeletonProps {
  width: string;
  height: string;
  borderRadius?: string;
  margin?: string;
  customClass?: string;
  animate?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonProps> = (props) => {
  const {
    width,
    height,
    borderRadius = 'rounded-custom',
    margin = 'my-2',
    customClass,
    animate = true
  } = props;
  return (
    <div
      className={`${borderRadius} ${
        animate ? 'custom-animation' : 'bg-gray-syn7'
      } w-${width} ${margin} h-${height}
      ${customClass ? customClass : ''}`}
    ></div>
  );
};
