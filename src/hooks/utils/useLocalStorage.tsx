// @ts-expect-error TS(7016): Could not find a declaration file for module 'glob... Remove this comment to see the full error message
import window from 'global';
import { useCallback, useEffect, useState } from 'react';

export const useLocalStorage = (
  key: string
  // @ts-expect-error TS(7051): Parameter has a name but no type. Did you mean 'ar... Remove this comment to see the full error message
): [string | any, (string) => void, () => void] => {
  return useStorage(key, window?.localStorage);
};

/**
 * Handles any window storage object that supports getItem and
 * setItem
 *
 * @param key
 * @param storageObject
 * @returns
 */
const useStorage = (
  key: any,
  storageObject: any
  // @ts-expect-error TS(7051): Parameter has a name but no type. Did you mean 'ar... Remove this comment to see the full error message
): [string, (string) => void, () => void] => {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject?.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
  });

  useEffect(() => {
    if (!window.localStorage) return;
    const jsonValue = storageObject.getItem(key);

    if (jsonValue != null) return setValue(JSON.parse(jsonValue));
  }, [key, storageObject]);

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, storageObject, value]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
};
