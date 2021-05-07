/** skeleton loader component
 * used to show component loading states when a single component is involved.
 * @param width the width for the loader
 * @param height the height of the loader
*/

export const SkeletonLoader = ({ width, height }) => {
  return <div className={`rounded-custom custom-animation w-${width} my-2 h-${height}`}></div>;
};
