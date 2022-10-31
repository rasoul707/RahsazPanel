// https://medium.com/better-programming/how-to-use-the-react-hook-usedeepeffect-815818c0ad9d

import React, { useEffect, useRef, useState, useCallback } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useDeepEffect(effectFunc, deps) {
  const prevDeps = usePrevious(deps);
  const isFirst = useRef(true);
  useEffect(() => {
    const isSame = JSON.stringify(prevDeps) === JSON.stringify(deps); // deep equality
    if (isFirst.current || !isSame) {
      effectFunc();
    }
    isFirst.current = false;
  }, deps);
}

// copy to clipBoard hook
export const useCopyToClipboard = (text, notifyTimeout = 2500) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus(true),
      () => setCopyStatus(false),
    );
  }, [text]);

  useEffect(() => {
    if (!copyStatus) {
      return;
    }

    const timeoutId = setTimeout(() => setCopyStatus(false), notifyTimeout);

    return () => clearTimeout(timeoutId);
  }, [copyStatus]);

  return [copyStatus, copy];
};
