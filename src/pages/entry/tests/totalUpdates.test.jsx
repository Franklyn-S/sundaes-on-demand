import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";

import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);
  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1, and check subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2, and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update toppings subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);
  // make sure total starts out $0.00
  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  // update cherries topping to 1, and check subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", { name: "Cherries" });
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // update M&Ms topping to 1, and check subtotal
  const MMsCheckbox = screen.getByRole("checkbox", { name: "M&Ms" });
  await user.click(MMsCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  // update hot fudge topping to 1, and check subtotal
  const hotFudgeCheckbox = screen.getByRole("checkbox", { name: "Hot fudge" });
  await user.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("4.50");

  // uncheck cherries topping and check subtotal
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  // uncheck M&Ms topping and check subtotal
  await user.click(MMsCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // uncheck hot fudge topping and check subtotal
  await user.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("0.00");
});

describe("grand total", () => {
  test("grand total starts at $0.00", () => {
    const { unmount } = render(<OrderEntry />);
    const total = screen.getByRole("heading", { name: /grand total: \$/i });
    expect(total).toHaveTextContent("0.00");
    unmount();
  });

  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const total = screen.getByRole("heading", { name: /grand total: \$/i });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(total).toHaveTextContent("2.00");
    const cherriesCheckbox = await screen.findByRole("checkbox", { name: "Cherries" });
    await user.click(cherriesCheckbox);
    expect(total).toHaveTextContent("3.50");
  });

  test("grand total updates properly if toppings is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const total = screen.getByRole("heading", { name: /grand total: \$/i });
    const cherriesCheckbox = await screen.findByRole("checkbox", { name: "Cherries" });
    await user.click(cherriesCheckbox);
    expect(total).toHaveTextContent("1.50");
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(total).toHaveTextContent("3.50");
  });

  test("grand total updates properly when an item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const total = screen.getByRole("heading", { name: /grand total: \$/i });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(total).toHaveTextContent("2.00");
    const cherriesCheckbox = await screen.findByRole("checkbox", { name: "Cherries" });
    await user.click(cherriesCheckbox);
    expect(total).toHaveTextContent("3.50");
    await user.click(cherriesCheckbox);
    expect(total).toHaveTextContent("2.00");
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "0");
    expect(total).toHaveTextContent("0.00");
  });
});
