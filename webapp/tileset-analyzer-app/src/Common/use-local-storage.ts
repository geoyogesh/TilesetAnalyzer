import { useState } from 'react';
import { load, save } from './localStorage';

export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState(() => load(key) ?? defaultValue);

  function handleValueChange(newValue: T) {
    setValue(newValue);
    save(key, newValue);
  }

  return [value, handleValueChange];
}
