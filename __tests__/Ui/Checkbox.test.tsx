import { fireEvent, render, screen } from "@testing-library/react";
import Checkbox from "@/components/Checkbox";

describe("Checkbox group", () => {
  const option = { name: "option 1", value: "option1" };
  const onChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    render(
      <Checkbox
        id={option.name}
        label={option.name}
        onChange={onChange}
        value={option.value}
        className="p-0"
        checked={true}
      />
    );
  });

  it("renders correctly with props", () => {
    expect(screen.getByLabelText(option.name)).toBeInTheDocument();
    expect(screen.getByText(option.name)).toHaveClass("p-0");
    expect(screen.getByLabelText(option.name)).toBeChecked();
  });

  it("fires onChange with correct values", async () => {
    fireEvent.click(screen.getByLabelText(option.name));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: option.value
        })
      })
    );
  });
});