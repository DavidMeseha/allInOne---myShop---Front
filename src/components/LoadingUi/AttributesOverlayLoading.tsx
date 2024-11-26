import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function AttributesOverlayLoading() {
  return (
    <SkeletonTheme baseColor="#d5d5d5" highlightColor="#ececec">
      <Skeleton className="mb-1" height={20} width={100} />
      <Skeleton className="mb-6" height={40} />
      <Skeleton className="mb-2" height={20} width={100} />
      <div className="mb-8 flex gap-6">
        <div className="flex items-center gap-2">
          <Skeleton circle height={24} width={24} />
          <Skeleton height={20} width={85} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton circle height={24} width={24} />
          <Skeleton height={20} width={85} />
        </div>
      </div>
      <Skeleton className="mb-2" height={20} width={100} />
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <Skeleton circle height={24} width={24} />
          <Skeleton height={20} width={85} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton circle height={24} width={24} />
          <Skeleton height={20} width={85} />
        </div>
      </div>
      <Skeleton className="mt-6" height={40} />
    </SkeletonTheme>
  );
}
