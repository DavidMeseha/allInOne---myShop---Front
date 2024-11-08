import { screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/HomePage";
import { useInView } from "react-intersection-observer";
import { mockHomeProduct, renderWithProviders } from "../mocks/values";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import en from "@/dictionaries/en.json";
import useEmblaCarousel from "embla-carousel-react";

describe("HomePage", () => {
  const mockLoadMore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/en");
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn()
    });
    (useInView as jest.Mock).mockReturnValue([jest.fn(), false]);
    (useEmblaCarousel as any).mockReturnValue([
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
    ]);
  });

  it("loads initial products correctly", async () => {
    renderWithProviders(<HomePage loadMore={mockLoadMore} products={[mockHomeProduct]} />);

    expect(screen.getByText(mockHomeProduct.name)).toBeInTheDocument();
  });

  it("loads more products and shows end of content", async () => {
    mockLoadMore.mockResolvedValueOnce({
      data: [
        { ...mockHomeProduct, _id: "3", name: "Product 3" },
        { ...mockHomeProduct, _id: "4", name: "Product 4" }
      ],
      pages: { currentPage: 2, totalPages: 2, hasNext: false }
    });

    (useInView as jest.Mock).mockReturnValue([jest.fn(), true]);
    renderWithProviders(
      <HomePage
        loadMore={mockLoadMore}
        products={[
          { ...mockHomeProduct, name: "Product 2", _id: "1" },
          { ...mockHomeProduct, name: "Product 1", _id: "1" }
        ]}
      />
    );

    expect(mockLoadMore).toHaveBeenCalledWith(2);

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Product 3")).toBeInTheDocument();
      expect(screen.getByText("Product 4")).toBeInTheDocument();
      const eocElements = screen.getAllByText(en["endOfContent"]);
      eocElements.forEach((element) => {
        expect(element).toBeInTheDocument();
        console.log(element);
      });
    });
  });

  // it("displays end of content message when no more products are available", async () => {
  // });
});
