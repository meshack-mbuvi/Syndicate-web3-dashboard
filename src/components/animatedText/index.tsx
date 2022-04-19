export const AnimatedText = (props: { text: string }): JSX.Element => (
  <span className="linear-wipe">{props.text}</span>
);
