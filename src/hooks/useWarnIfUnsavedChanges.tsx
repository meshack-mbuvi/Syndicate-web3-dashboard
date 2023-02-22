import Router from 'next/router';
import { useEffect } from 'react';

/**
 * @description - this hook will warn the user if they attempt to navigate away using any app or browser navigation
 * @example - useWarnIfUnsavedRouterChanges(true);
 * @param unsavedChanges - boolean value indicating whether there are unsaved changes
 * @returns void - this hook does not return anything
 */
export const useWarnIfUnsavedRouterChanges = (
  unsavedChanges: boolean
): void => {
  useEffect(() => {
    const warningText =
      'You may have unsaved changes, are you sure you wish to leave this page?';

    // callback function for window close or hard reload
    const handleWindowClose = (e: BeforeUnloadEvent): string | undefined => {
      if (!unsavedChanges) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };

    // callback function for router change
    const handleBrowseAway = () => {
      if (!unsavedChanges) return;
      if (window.confirm(warningText)) return;
      Router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    Router.events.on('routeChangeStart', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      Router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [unsavedChanges]);
};
