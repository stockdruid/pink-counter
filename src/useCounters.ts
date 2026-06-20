import { useCallback, useEffect, useState } from 'react';
import { Counter, PinkColor, PINK_COLOR_KEYS } from './types';
import { loadCounters, saveCounters } from './storage';

let idCounter = 0;
function genId(): string {
  return `c_${Date.now()}_${idCounter++}`;
}

export function useCounters() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadCounters().then((data) => {
      setCounters(data.length > 0 ? data : [
        { id: genId(), name: '총건수', value: 0, colorKey: 'rose' },
        { id: genId(), name: '실건수', value: 0, colorKey: 'coral' },
      ]);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveCounters(counters);
  }, [counters, loaded]);

  const increment = useCallback((id: string) => {
    setCounters((prev) => prev.map((c) => c.id === id ? { ...c, value: c.value + 1 } : c));
  }, []);

  const decrement = useCallback((id: string) => {
    setCounters((prev) => prev.map((c) => c.id === id ? { ...c, value: Math.max(0, c.value - 1) } : c));
  }, []);

  const reset = useCallback((id: string) => {
    setCounters((prev) => prev.map((c) => c.id === id ? { ...c, value: 0 } : c));
  }, []);

  const rename = useCallback((id: string, name: string) => {
    setCounters((prev) => prev.map((c) => c.id === id ? { ...c, name } : c));
  }, []);

  const changeColor = useCallback((id: string, colorKey: PinkColor) => {
    setCounters((prev) => prev.map((c) => c.id === id ? { ...c, colorKey } : c));
  }, []);

  const add = useCallback(() => {
    const colorKey = PINK_COLOR_KEYS[counters.length % PINK_COLOR_KEYS.length];
    setCounters((prev) => [...prev, {
      id: genId(),
      name: `카운터 ${prev.length + 1}`,
      value: 0,
      colorKey,
    }]);
  }, [counters.length]);

  const remove = useCallback((id: string) => {
    setCounters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { counters, loaded, increment, decrement, reset, rename, changeColor, add, remove };
}
