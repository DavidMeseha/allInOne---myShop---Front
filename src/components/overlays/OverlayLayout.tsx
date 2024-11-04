import useClickRecognition from "@/hooks/useClickRecognition";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { RiCloseLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  title?: string;
  children: React.ReactNode;
  close: () => void;
  isLoading?: boolean;
  isOpen: boolean;
};

export default function OverlayLayout({ children, close, className, title, isLoading, isOpen }: Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let timeoutId: number;
    if (!isOpen) {
      timeoutId = window.setTimeout(() => setIsAnimating(false), 150);
    } else {
      setIsAnimating(true);
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useClickRecognition(close, containerRef);
  return (
    <div
      className={`fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-black bg-opacity-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"} ${isAnimating ? "visible" : "invisible"}`}
    >
      <div
        className={`flex min-h-screen items-end justify-center pt-40 transition-transform md:items-center md:py-8 ${isOpen ? "translate-y-0" : "translate-y-20"}`}
      >
        <div
          ref={containerRef}
          className={twMerge(
            clsx("w-full rounded-b-none rounded-t-md bg-white p-4 md:max-w-[470px] md:rounded-lg", className)
          )}
        >
          <div className="mb-3 flex w-full items-center justify-between">
            <div className="text-xl font-semibold text-gray-700">{title}</div>
            <button className="rounded-full bg-gray-100 p-1.5" onClick={close}>
              <RiCloseLine size="26" />
            </button>
          </div>
          <div className="relative min-h-80 md:min-h-min">
            {isLoading ? (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#ffffff85]">
                <BiLoaderCircle className="animate-spin fill-primary" size={35} />
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
