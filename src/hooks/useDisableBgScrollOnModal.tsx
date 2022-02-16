import { useEffect } from "react";

export const useDisableBgScrollOnModal = (show: boolean): void => {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
  
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);
};
