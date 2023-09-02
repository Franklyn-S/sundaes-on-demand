import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";
import SummaryForm from "./SummaryForm";

export default function OrderSummary() {
  const { totals, optionCounts } = useOrderDetails();

  const scoopArray = Object.entries(optionCounts.scoops); // [["chocolate", 1], ["vanilla", 2"]]
  const scoopList = scoopArray.map(([scoop, count]) => (
    <li key={scoop}>
      {count} {scoop}
    </li>
  ));
  const toppingsArray = Object.keys(optionCounts.toppings);
  const toppingList = toppingsArray.map(topping => <li key={topping}>{topping}</li>);

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {formatCurrency(totals.scoops)} </h2>
      <ul>{scoopList}</ul>
      <h2>Toppings: {formatCurrency(totals.toppings)} </h2>
      <ul>{toppingList}</ul>
      <SummaryForm />
    </div>
  );
}
