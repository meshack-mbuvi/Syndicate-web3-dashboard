import React from 'react';

/**
 * This is a wrapper to provide fade in effect when a component renders.
 * It comes in handy when 2 components switch too fast that it appears as a glitch
 *  Example: on deposit page, switching between Manager and Depositor accounts with MetaMask
 * Resource https://www.joshwcomeau.com/snippets/react-components/fade-in/
 * @param props
 * @returns ReactChild
 */
const FadeIn: React.FC<{
  duration?: number;
  delay?: number;
}> = ({ duration = 300, delay = 0, children }) => {
  return (
    <div
      className={`fadein-wrapper`}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationName: 'fadein-wrapper'
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
