import React from "react";

interface Props {
  styles: string;
}

const GradientAvatar = (props: Props) => {
  const { styles } = props;

  return <div className={`h-5 w-5 rounded-full ${styles}`}></div>;
};

export default GradientAvatar;
