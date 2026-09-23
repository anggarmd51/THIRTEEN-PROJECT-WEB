import { useState, useEffect } from "react";

export function useFormDraft<T>(storageKey: string, initialData: T, isEditing: boolean) {
  // When adding new (not editing), initialize from localStorage draft if present
  const [data, setData] = useState<T>(() => {
    if (isEditing) return initialData;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialData, ...parsed };
      }
    } catch (err) {
      console.warn(`[Draft] Gagal membaca draft "${storageKey}":`, err);
    }
    return initialData;
  });

  // Keep draft updated in localStorage as user types, ONLY for new additions (not editing existing DB items)
  useEffect(() => {
    if (isEditing) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (err) {
      console.warn(`[Draft] Gagal menyimpan draft "${storageKey}":`, err);
    }
  }, [storageKey, data, isEditing]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.warn(`[Draft] Gagal menghapus draft "${storageKey}":`, err);
    }
  };

  const hasDraft = (): boolean => {
    try {
      return Boolean(localStorage.getItem(storageKey));
    } catch {
      return false;
    }
  };

  return {
    data,
    setData,
    clearDraft,
    hasDraft,
  };
}
