import React from "react";

interface Props {
  styles: string;
}

const GradientAvatar = (props: Props) => {
  const { styles } = props;

  return <div className={`h-7 w-7 rounded-full ${styles}`}></div>;
};

export default GradientAvatar;
