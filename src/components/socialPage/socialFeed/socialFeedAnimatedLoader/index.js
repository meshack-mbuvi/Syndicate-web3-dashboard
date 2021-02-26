import React from "react";
import { Divider } from "src/components/divider";

/**
 * Renders an animated loader for social feed
 */
export const SocialFeedAnimatedLoader = () => {
  /**
   * This method creates a list of loader items
   * @param {number} count the number of loader items to be rendered
   * @returns {array} animations list of loader items
   */
  const showLoader = (count) => {
    const animations = [];
    for (let i = 0; i < count; i++) {
      animations.push(
        <>
          <div className="wrapper-cell flex justify-between m-auto">
            <div className="flex flex-1">
              <div className="image"></div>
              <div className="text">
                <div className="text-line"></div>
                <div className="text-line"></div>
              </div>
            </div>
            <div className="card-placeholder"></div>
          </div>
          <Divider />
        </>
      );
    }
    return animations;
  };

  return <>{showLoader(9)}</>;
};
