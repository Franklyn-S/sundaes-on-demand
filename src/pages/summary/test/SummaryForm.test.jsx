import SummaryForm from "../SummaryForm";
import { fireEvent, render, screen } from "@testing-library/react";

test("should render SummaryForm with initial values", () => {
  render(<SummaryForm />);
  const checkboxLabel = "I agree to Terms and Conditions";
  const checkbox = screen.getByRole("checkbox", { name: checkboxLabel });
  expect(checkbox).not.toBeChecked();

  const button = screen.getByRole("button", { name: /confirm order/i });
  expect(button).toBeDisabled();
});

test("Checking checkbox enable the button and unchecking disables the button", () => {
  render(<SummaryForm />);
  const checkboxLabel = "I agree to Terms and Conditions";
  const checkbox = screen.getByRole("checkbox", { name: checkboxLabel });
  const button = screen.getByRole("button", { name: /confirm order/i });

  fireEvent.click(checkbox);
  expect(button).toBeEnabled();

  fireEvent.click(checkbox);
  expect(button).toBeDisabled();
});
