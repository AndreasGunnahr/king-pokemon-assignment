import { useCallback, useRef, useState } from 'react';

interface InfiniteList<T> {
  /** The visible prefix of `items`. */
  visible: T[];
  /** Attach to a sentinel element at the end of the list. */
  sentinelRef: (node: HTMLElement | null) => void;
  hasMore: boolean;
}

/**
 * Reveal a long array in batches as a sentinel element scrolls into view.
 * The visible count resets to one batch whenever `items` changes identity
 * (e.g. the filter/search result is replaced).
 */
export const useInfiniteList = <T>(
  items: T[],
  batchSize = 60,
): InfiniteList<T> => {
  const [count, setCount] = useState(batchSize);

  // Reset the window when the source list is replaced. Adjusting state during
  // render avoids an extra effect + render pass.
  const [prevItems, setPrevItems] = useState(items);
  if (prevItems !== items) {
    setPrevItems(items);
    setCount(batchSize);
  }

  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasMore = count < items.length;

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      if (!node) {
        return;
      }
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          setCount((prev) => prev + batchSize);
        }
      });
      observerRef.current.observe(node);
    },
    [batchSize],
  );

  return { visible: items.slice(0, count), sentinelRef, hasMore };
};
