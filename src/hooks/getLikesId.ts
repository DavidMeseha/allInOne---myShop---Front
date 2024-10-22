import axiosInstanceNew from "@/lib/axiosInstanceNew";

const getLikeIds = async () => {
  try {
    const items = await axiosInstanceNew.get<string[]>("/api/user/likesId");
    return items.data;
  } catch {
    return [];
  }
};

export default getLikeIds;
