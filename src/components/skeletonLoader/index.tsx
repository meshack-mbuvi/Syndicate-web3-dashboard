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
  margin?: string;
  customClass?: string;
}

export const SkeletonLoader = (props: SkeletonProps) => {
  const {
    width,
    height,
    borderRadius = "rounded-custom",
    margin = "my-2",
    customClass,
  } = props;
  return (
    <div
      className={`${borderRadius} custom-animation w-${width} ${margin} h-${height}
      ${customClass ? customClass : ""}`}
    ></div>
  );
};
