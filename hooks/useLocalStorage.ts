import { useEffect, useRef, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  // Start with the default to avoid hydration mismatch.
  const [value, setValue] = useState<T>(initialValue);

  // Prevent the initial save from overwriting stored data.
  const skipNextSaveRef = useRef(true);

  // Restore the saved value after mount.
  useEffect(() => {
    skipNextSaveRef.current = true;

    if (typeof window === "undefined") return;

    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        // Read localStorage after mount to avoid hydration issues.
        setValue(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error(`Error reading "${key}" from localStorage:`, error);
    }
  }, [key]);

  // Save changes, skipping the initial restore.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}