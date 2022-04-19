import HorizontalDivider from '@/components/horizontalDivider';

/**
 * This method creates a list of loader items
 * @param {number} count the number of loader items to be rendered
 * @returns {array} animations list of loader items
 */
export const showLoader = (count: number): Array<React.FC> => {
  const animations = [];
  for (let i = 0; i < count; i++) {
    animations.push(
      <div key={i}>
        <div className="w-full flex justify-between sm:m-auto">
          <div className="flex flex-1">
            <div className="image"></div>
            <div className="w-3/4">
              <div className="custom-animation w-full my-2 h-2"></div>
              <div className="custom-animation w-1/2 my-2 h-2"></div>
            </div>
          </div>
          <div className="card-placeholder w-16 sm:w-24 mb-2"></div>
        </div>
        <HorizontalDivider />
      </div>
    );
  }
  return animations;
};
