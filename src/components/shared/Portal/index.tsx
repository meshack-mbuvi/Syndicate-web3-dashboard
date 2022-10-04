import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactNode;
  parentComponent?: Element;
}

const Portal = (props: Props): JSX.Element => {
  const { children, parentComponent = document.body } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  // @ts-expect-error TS(2322): Type 'ReactPortal | null' is not assignable to typ... Remove this comment to see the full error message
  return mounted ? createPortal(children, parentComponent) : null;
};

export default Portal;
