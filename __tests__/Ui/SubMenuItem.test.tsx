import { act, fireEvent, screen } from "@testing-library/react";
import SubMenuItem from "@/components/SubMenuItem";
import en from "@/dictionaries/en.json";
import { BsCompass, BsCompassFill } from "react-icons/bs";
import { renderWithTransation } from "../../test-mic";
import { usePathname } from "next/navigation";

describe("Sub Menu Item", () => {
  const menuItem = {
    name: en["discover"],
    sup: [
      {
        name: en["categories"],
        to: `/discover/categories`
      },
      {
        name: en["vendors"],
        to: `/discover/vendors`
      },
      {
        name: en["tags"],
        to: `/discover/tags`
      }
    ],
    Icon: <BsCompass data-testid="discover-item-icon" size={20} />,
    IconActive: <BsCompassFill size={20} />
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // (useLocalPathname as jest.Mock).mockReturnValue({ pathname: menuItem.sup[0].to });
    (usePathname as jest.Mock).mockReturnValue("/en" + menuItem.sup[0].to);
    renderWithTransation(<SubMenuItem item={menuItem} />);
  });

  it("renders correctly", () => {
    expect(screen.getByText(menuItem.name)).toBeInTheDocument();
    menuItem.sup.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.name)).toHaveAttribute("href", "/en" + item.to);
    });
    expect(screen.getByTestId("sub-items")).toHaveClass("max-h-0");
    expect(screen.getByTestId("discover-item-icon")).toBeInTheDocument();
  });

  it("toggels", async () => {
    expect(screen.getByText(menuItem.name)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText(menuItem.name));
    });
    expect(screen.getByTestId("sub-items")).toHaveClass("max-h-52");
    await act(async () => {
      fireEvent.click(screen.getByText(menuItem.name));
    });
    expect(screen.getByTestId("sub-items")).toHaveClass("max-h-0");
  });

  it("highlights when page matchs route", () => {
    expect(screen.getByText(menuItem.sup[0].name)).toHaveClass("bg-lightGray text-primary");
    expect(screen.getByText(menuItem.sup[1].name)).not.toHaveClass("bg-lightGray text-primary");
    expect(screen.getByText(menuItem.sup[2].name)).not.toHaveClass("bg-lightGray text-primary");
  });
});
