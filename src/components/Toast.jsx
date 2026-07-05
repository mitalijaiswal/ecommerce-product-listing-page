import React, { useEffect, useState, useCallback } from "react";

let addToastFn = null;

export function showToast(message) {
  if (addToastFn) addToastFn(message);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-in-up rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
