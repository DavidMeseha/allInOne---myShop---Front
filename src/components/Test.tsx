"use client";

import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { useQuery } from "@tanstack/react-query";

export default function Test() {
  const query = useQuery({
    queryKey: ["test"],
    queryFn: () => axiosInstanceNew.get("/api/Home/GetHomePgaeProducts").then((res) => res.data)
  });

  console.log(query.data);
  return <div>Test</div>;
}
