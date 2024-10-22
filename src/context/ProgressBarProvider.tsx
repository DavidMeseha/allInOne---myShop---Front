import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

type Props = {
  children: React.ReactNode;
};

export default function ProgressBarProvider({ children }: Props) {
  return (
    <>
      {children}
      <ProgressBar color="#FA2D6C" height="4px" options={{ showSpinner: false }} shallowRouting />
    </>
  );
}
