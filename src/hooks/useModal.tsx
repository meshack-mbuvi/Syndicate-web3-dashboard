import { useState } from 'react';

const useModal = (): [boolean, () => void] => {
  const [isShowing, setIsShowing] = useState(false);

  const toggleModal = (): void => {
    setIsShowing(!isShowing);
  };

  return [isShowing, toggleModal];
};

export default useModal;
