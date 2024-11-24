"use client";

import { RefObject, useEffect } from "react";

export default function ClickRecognition(exit: () => void, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && event.target && !containerRef.current.contains(event.target as Node)) {
        exit();
      }
    }

    function handleTouchOutside(event: TouchEvent) {
      if (containerRef.current && event.target && !containerRef.current.contains(event.target as Node)) {
        exit();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, [containerRef]);
}
