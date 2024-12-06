import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";

type Props = HTMLMotionProps<"div"> & React.HTMLAttributes<HTMLDivElement>;

export function div(props: Props) {
  return <motion.div {...props}>{props.children}</motion.div>;
}
