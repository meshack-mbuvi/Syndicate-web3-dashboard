import { useState } from 'react';

export default function useForceUpdate() {
  const [, setValue] = useState(0); // integer state
  return (): void => setValue((value) => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}
