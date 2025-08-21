import {useRef, useEffect, useCallback} from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
  React.RefObject<T>,
  React.RefObject<T>,
  () => void
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  const scrollToBottom = useCallback(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  const scrollPageToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    // Create a ResizeObserver to watch for content changes
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        scrollToBottom();
        scrollPageToBottom();
      }, 500);
    });

    // Create a MutationObserver to watch for DOM changes
    const mutationObserver = new MutationObserver(() => {
      // Small delay to ensure content has been rendered
      setTimeout(() => {
        scrollToBottom();
        scrollPageToBottom();
      }, 500);
    });

    // Start observing
    resizeObserver.observe(container);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Initial scroll to bottom
    setTimeout(() => {
      scrollToBottom();
      scrollPageToBottom();
    }, 500);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [scrollToBottom, scrollPageToBottom]);

  return [containerRef, endRef, scrollPageToBottom];
}
