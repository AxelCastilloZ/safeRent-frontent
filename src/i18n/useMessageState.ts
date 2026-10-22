import { useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveMessage, type MessageDescriptor } from './messages';

type Stored<T> = T extends string ? T | MessageDescriptor : T extends null ? null | MessageDescriptor : T extends object ? { [K in keyof T]: Stored<T[K]> } : T;

function resolve<T>(value: Stored<T>): T {
  if (value && typeof value === 'object') {
    if ('key' in value && typeof value.key === 'string') return resolveMessage(value as MessageDescriptor) as T;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item)])) as T;
  }
  return value as T;
}

/** Stores descriptors instead of translated snapshots, preserving existing notices on locale changes. */
export function useMessageState<T>(initial: T | (() => T)): [T, Dispatch<SetStateAction<Stored<T>>>] {
  useTranslation();
  const [stored, setStored] = useState<Stored<T>>(() => (typeof initial === 'function' ? (initial as () => T)() : initial) as Stored<T>);
  return [resolve<T>(stored), setStored];
}
