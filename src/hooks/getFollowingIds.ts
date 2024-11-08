import axios from "@/lib/axios";

const getFollowingIds = async () => {
  try {
    const ids = await axios.get<string[]>(`/api/user/followingIds`);
    return ids.data;
  } catch {
    return [];
  }
};

export default getFollowingIds;
