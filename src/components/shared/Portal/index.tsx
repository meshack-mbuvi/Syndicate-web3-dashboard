import { useEffect, useState, ReactNode, FC } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
}

const Portal: FC = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

export default Portal;
