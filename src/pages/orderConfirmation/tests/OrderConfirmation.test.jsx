import { render, screen } from "../../../test-utils/testing-library-utils";

import OrderConfirmation from "../OrderConfirmation";

import { rest } from "msw";
import { server } from "../../../mocks/server";

test("handles error for order confirmation", async () => {
  server.resetHandlers(
    rest.post("http://localhost:3030/order", (req, res, ctx) => res(ctx.status(500)))
  );

  render(<OrderConfirmation moveOrderPhase={jest.fn()} />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error occurred. Please try again later."
  );
});
