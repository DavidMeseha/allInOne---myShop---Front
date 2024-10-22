import axios from "@/lib/axiosInstanceNew";

const getFollowingIds = async () => {
  try {
    const ids = await axios.get<string[]>(`/api/user/followingIds`);
    return ids.data;
  } catch {
    return [];
  }
};

export default getFollowingIds;
