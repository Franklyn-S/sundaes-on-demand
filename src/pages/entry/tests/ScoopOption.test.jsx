import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test-utils/testing-library-utils";
import ScoopOption from "../ScoopOption";

test("Red box appears for invalid scoop count", async () => {
  const user = userEvent.setup();
  render(<ScoopOption />);

  // expect input to be invalid with negative number
  const vanillaInput = screen.getByRole("spinbutton");
  await user.type(vanillaInput, "-1");
  expect(vanillaInput).toHaveClass("is-invalid");

  // // replace with decimal input
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2.5");
  expect(vanillaInput).toHaveClass("is-invalid");

  // replace with input that's too high
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "11");
  expect(vanillaInput).toHaveClass("is-invalid");

  // replace with valid input
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");
  expect(vanillaInput).not.toHaveClass("is-invalid");
});
