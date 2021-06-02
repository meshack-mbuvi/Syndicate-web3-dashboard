import React from "react";

/** skeleton loader component
 * used to show component loading states when a single component is involved.
 * @param width the width for the loader
 * @param height the height of the loader
 */
interface SkeletonProps {
  width: string;
  height: string;
  borderRadius?: string;
}

export const SkeletonLoader = (props: SkeletonProps) => {
  const { width, height, borderRadius = "rounded-custom" } = props;
  return (
    <div
      className={`${borderRadius} custom-animation w-${width} my-2 h-${height}`}></div>
  );
};
