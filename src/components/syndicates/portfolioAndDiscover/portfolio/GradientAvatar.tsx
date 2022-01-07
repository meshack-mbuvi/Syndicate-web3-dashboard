import React from "react";

interface Props {
  name: string | string[];
  size?: string;
  customClasses?: string;
}

const GradientAvatar: React.FC<Props> = (props) => {
  const { name, size = "h-7 w-7", customClasses } = props;

  function djb2Hash(str) {
    const len = str.length;
    let hash = 5381;
    for (let idx = 0; idx < len; ++idx) {
      hash = 33 * hash + str.charCodeAt(idx);
    }
    return hash;
  }

  const hashValue = djb2Hash(name);
  const degreesInACircle = 360;
  const hue1 = hashValue % degreesInACircle;
  const hue2 = (hue1 + 120) % degreesInACircle;

  return (
    <div
      className={`${size} rounded-full ${customClasses ?? ""}`}
      style={{
        background: `linear-gradient(hsl(${hue1}deg, 100%, 50%), hsl(${hue2}deg, 30%, 70%)`,
      }}
    ></div>
  );
};

export default GradientAvatar;
