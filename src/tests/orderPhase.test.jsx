import { render, screen } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();
  // render the app
  const { unmount } = render(<App />);
  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  const cherriesCheckbox = await screen.findByRole("checkbox", { name: "Cherries" });
  await user.click(cherriesCheckbox);

  // find and click order button
  const orderButton = await screen.findByRole("button", { name: /order sundae/i });
  await user.click(orderButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();
  const scoopsSubtotal = screen.getByText("Scoops: $2.00");
  expect(scoopsSubtotal).toBeInTheDocument();
  const toppingsSubtotal = screen.getByText("Toppings: $1.50");
  expect(toppingsSubtotal).toBeInTheDocument();
  const grandTotal = screen.getByRole("heading", { name: /total:/i });
  expect(grandTotal).toBeInTheDocument();

  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const termsAndConditionsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(termsAndConditionsCheckbox);

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  await user.click(confirmButton);

  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you!/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  await user.click(newOrderButton);

  // check that scoops and toppings subtotal has been reset
  const scoopsSubtotalAfterReset = screen.getByText("Scoops total: $0.00");
  expect(scoopsSubtotalAfterReset).toBeInTheDocument();
  const toppingsSubtotalAfterReset = screen.getByText("Toppings total: $0.00");
  expect(toppingsSubtotalAfterReset).toBeInTheDocument();
  // do we need to await anything to avoid test errors?
  unmount();
});

test("order phases for happy path with no toppings", async () => {
  const user = userEvent.setup();
  // render the app
  render(<App />);
  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  // find and click order button
  const orderButton = screen.getByRole("button", { name: /order sundae/i });
  await user.click(orderButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();
  const scoopsSubtotal = screen.getByRole("heading", { name: "Scoops: $2.00" });
  expect(scoopsSubtotal).toBeInTheDocument();
  const toppingsSubtotal = screen.queryByText(/toppings/i);
  expect(toppingsSubtotal).not.toBeInTheDocument();
  const grandTotal = screen.getByRole("heading", { name: /total:/i });
  expect(grandTotal).toBeInTheDocument();
});

test("Toppings header is not on summary page if toppings are order, then removed", async () => {
  const user = userEvent.setup();
  // render the app
  render(<App />);
  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  // add topping and confirm
  const cherriesCheckbox = await screen.findByRole("checkbox", { name: "Cherries" });
  await user.click(cherriesCheckbox);
  expect(cherriesCheckbox).toBeChecked();
  const toppingsTotal = screen.getByText("Toppings total: $", { exact: false });
  expect(toppingsTotal).toBeInTheDocument();

  // remove the topping
  await user.click(cherriesCheckbox);
  expect(cherriesCheckbox).not.toBeChecked();
  expect(toppingsTotal).toHaveTextContent("0.00");

  // find and click order button
  const orderButton = screen.getByRole("button", { name: /order sundae/i });
  await user.click(orderButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();
  const scoopsSubtotal = screen.getByRole("heading", { name: "Scoops: $2.00" });
  expect(scoopsSubtotal).toBeInTheDocument();
  const toppingsSubtotal = screen.queryByText(/toppings/i);
  expect(toppingsSubtotal).not.toBeInTheDocument();
  const grandTotal = screen.getByRole("heading", { name: /total:/i });
  expect(grandTotal).toBeInTheDocument();
});
