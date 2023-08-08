import SummaryForm from "../SummaryForm";
import { queryByText, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

test("should render SummaryForm with initial values", () => {
  render(<SummaryForm />);
  const checkboxLabel = "I agree to Terms and Conditions";
  const checkbox = screen.getByRole("checkbox", { name: checkboxLabel });
  expect(checkbox).not.toBeChecked();

  const button = screen.getByRole("button", { name: /confirm order/i });
  expect(button).toBeDisabled();
});

test("Checking checkbox enable the button and unchecking disables the button", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);
  const checkboxLabel = "I agree to Terms and Conditions";
  const checkbox = screen.getByRole("checkbox", { name: checkboxLabel });
  const button = screen.getByRole("button", { name: /confirm order/i });

  await user.click(checkbox);
  expect(button).toBeEnabled();

  await user.click(checkbox);
  expect(button).toBeDisabled();
});

test("popover responds to hover", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);
  // popover starts out hidden
  const nullPopover = screen.queryByText(/no ice cream will actually be delivered/i);
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears on mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsAndConditions);
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  // popover disappears when we mouse out
  await user.unhover(termsAndConditions);
  expect(popover).not.toBeInTheDocument();
});
