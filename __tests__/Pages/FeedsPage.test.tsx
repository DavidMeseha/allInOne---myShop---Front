import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { useInView } from "react-intersection-observer";
import { mockHomeProduct } from "../../__mocks__/values";
import { useRouter } from "next-nprogress-bar";
import useEmblaCarousel from "embla-carousel-react";
import en from "@/dictionaries/en.json";
import { renderWithProviders } from "../../test-mic";
import { usePathname, useSearchParams } from "next/navigation";
import InfiniteFeed from "@/app/[lang]/feeds/InfiniteFeed";

describe("HomePage", () => {
  const mockLoadMore = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/en/feeds");
    (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn });
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

  it("loads initial products correctly and shows loading for more products", async () => {
    await act(async () => {
      renderWithProviders(<InfiniteFeed loadMore={mockLoadMore} products={[mockHomeProduct]} />);
    });
    expect(screen.getByText(mockHomeProduct.name)).toBeInTheDocument();
    const loading = screen.getAllByTestId("loading");
    loading.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  it("loads more products and shows end of content", async () => {
    mockLoadMore.mockResolvedValueOnce({
      data: [
        { ...mockHomeProduct, _id: "3", name: "Product 3" },
        { ...mockHomeProduct, _id: "4", name: "Product 4" }
      ],
      pages: { currentPage: 2, totalPages: 2, hasNext: false }
    });

    (useInView as jest.Mock).mockReturnValueOnce([jest.fn(), true]);
    await act(async () => {
      renderWithProviders(
        <InfiniteFeed
          loadMore={mockLoadMore}
          products={[
            { ...mockHomeProduct, name: "Product 2", _id: "1" },
            { ...mockHomeProduct, name: "Product 1", _id: "1" }
          ]}
        />
      );
    });

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();

    expect(mockLoadMore).toHaveBeenCalledWith(2);

    await waitFor(() => {
      expect(screen.getByText("Product 3")).toBeInTheDocument();
      expect(screen.getByText("Product 4")).toBeInTheDocument();
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      const eocElements = screen.getAllByText(en["endOfContent"]);
      eocElements.forEach((element) => {
        expect(element).toBeInTheDocument();
      });
    });
  });

  it("open & close main menu on mobile", async () => {
    await act(async () => {
      renderWithProviders(<InfiniteFeed loadMore={mockLoadMore} products={[mockHomeProduct]} />);
    });
    expect(screen.getByLabelText("Open Main Menu")).toBeInTheDocument();
    expect(screen.getByTestId("main-menu")).toBeInTheDocument();
    expect(screen.getByTestId("close-main-menu")).toBeInTheDocument();
    expect(screen.getByTestId("main-menu")).toHaveClass("-start-full");

    act(() => {
      fireEvent.click(screen.getByLabelText("Open Main Menu"));
    });
    expect(screen.getByTestId("main-menu")).toHaveClass("start-0");

    act(() => {
      fireEvent.click(screen.getByTestId("close-main-menu"));
    });
    expect(screen.getByTestId("main-menu")).toHaveClass("-start-full");
  });

  it("opens search popup on mobile", async () => {
    await act(async () => {
      renderWithProviders(<InfiniteFeed loadMore={mockLoadMore} products={[mockHomeProduct]} />);
    });
    expect(screen.getByLabelText("Open Search Page")).toBeInTheDocument();
    expect(screen.getByTestId("main-menu")).toBeInTheDocument();
    expect(screen.getByTestId("close-main-menu")).toBeInTheDocument();
    expect(screen.getByTestId("main-menu")).toHaveClass("-start-full");

    act(() => {
      fireEvent.click(screen.getByLabelText("Open Search Page"));
    });
    expect(screen.getByTestId("search-overlay")).toBeInTheDocument();
  });
});
