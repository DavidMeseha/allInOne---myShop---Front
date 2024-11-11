import { screen, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { renderDiscoverPages } from "../../../test-mic";
import CategoriesView from "@/app/[lang]/discover/components/CategoriesView";
import axios from "@/lib/axios";

jest.mock("../../../src/lib/axios.ts");

describe("HomePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/en/discover/categories");
  });

  it("starts with loading spinner", () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: [], pages: {} } });
    renderDiscoverPages(<CategoriesView />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays categories after fetching", async () => {
    const mockCategories = [
      { _id: "1", name: "Category 1", productsCount: 5 },
      { _id: "2", name: "Category 2", productsCount: 10 }
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockCategories, pages: { hasNext: true } } });
    renderDiscoverPages(<CategoriesView />);

    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
      expect(screen.getByText("Category 2")).toBeInTheDocument();
    });
  });
});
