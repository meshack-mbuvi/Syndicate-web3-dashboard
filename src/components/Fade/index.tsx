import React from "react";
import { useSpring, animated } from "react-spring";

interface FadeProps {
  delay?: number;
  children: React.ReactNode;
}

const Fade: React.FC<FadeProps> = ({ delay = 400, children }) => {
  const styles = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: delay,
  });
  return <animated.div style={styles}>{children}</animated.div>;
};

export default Fade;
