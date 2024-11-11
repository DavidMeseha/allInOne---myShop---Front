// Learn more: https://github.com/testing-library/jest-dom
import { LocalLink } from "@/components/LocalizedNavigation";
import getCartIds from "@/hooks/getCartItems";
import getCountries from "@/hooks/getCountries";
import getFollowingIds from "@/hooks/getFollowingIds";
import getLikeIds from "@/hooks/getLikesId";
import getReviewedIds from "@/hooks/getReviewIds";
import getSavesId from "@/hooks/getSavesId";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";

class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    // Trigger the callback with the entry
    this.callback([{ isIntersecting: true, target: element }]);
  }

  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;

jest.mock("embla-carousel-react", () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return [
        jest.fn(),
        {
          scrollTo: jest.fn(),
          canScrollPrev: jest.fn(() => true),
          canScrollNext: jest.fn(() => true),
          on: jest.fn((event, callback) => {
            if (event === "scroll") {
              const emblaApi = { selectedScrollSnap: jest.fn(() => 0) };
              callback(emblaApi);
            }
          }),
          off: jest.fn((event, callback) => {
            if (event === "scroll") callback();
          }),
          destroy: jest.fn()
        }
      ];
    })
  };
});

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn()
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn()
}));

jest.mock("next-nprogress-bar", () => {
  return {
    AppProgressBar: jest.fn(() => null),
    useRouter: jest.fn()
  };
});

jest.mock("./src/lib/axios.ts");

jest.mock("./src/hooks/getCartItems.ts", () => jest.fn());
jest.mock("./src/hooks/getCountries.ts", () => jest.fn());
jest.mock("./src/hooks/getFollowingIds.ts", () => jest.fn());
jest.mock("./src/hooks/getLikesId.ts", () => jest.fn());
jest.mock("./src/hooks/getReviewIds.ts", () => jest.fn());
jest.mock("./src/hooks/getSavesId.ts", () => jest.fn());

act(() => {
  getCartIds.mockResolvedValue([]);
  getCountries.mockResolvedValue([]);
  getFollowingIds.mockResolvedValue([]);
  getLikeIds.mockResolvedValue([]);
  getReviewedIds.mockResolvedValue([]);
  getSavesId.mockResolvedValue([]);
});
