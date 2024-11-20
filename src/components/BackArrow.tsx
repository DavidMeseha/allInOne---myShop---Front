"use client";

import React from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

type Props = {
  onClick: () => void;
  color?: string;
};

export default function BackArrow({ onClick, color }: Props) {
  return (
    <button aria-label="back" onClick={onClick}>
      {document.dir === "rtl" ? <BsArrowRight color={color} size={25} /> : <BsArrowLeft color={color} size={25} />}
    </button>
  );
}
