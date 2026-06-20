import AsyncStorage from '@react-native-async-storage/async-storage';
import { Counter } from './types';

const STORAGE_KEY = 'pink_counters';

export async function loadCounters(): Promise<Counter[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export async function saveCounters(counters: Counter[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
}
