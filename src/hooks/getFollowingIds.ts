import axios from "@/lib/axios";

const getFollowingIds = async () => {
  try {
    const ids = await axios.get<string[]>(`/api/common/followingIds`);
    return ids.data;
  } catch {
    return [];
  }
};

export default getFollowingIds;
