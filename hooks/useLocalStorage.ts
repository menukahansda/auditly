import { useState, useEffect } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
    // load directly from localStorage to avoid hydration issues
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    const storedValue = localStorage.getItem(key);
    if (!storedValue) return initialValue;

    try {
      return JSON.parse(storedValue);
    } catch {
      return initialValue;
    }
  });

  // save on changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}