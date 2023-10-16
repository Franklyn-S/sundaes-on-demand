import Options from "./Options";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";
import { Button } from "react-bootstrap";

export default function OrderEntry({ moveOrderPhase }) {
  const { totals } = useOrderDetails();
  return (
    <div>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>Grand total: {formatCurrency(totals.toppings + totals.scoops)}</h2>
      <Button disabled={totals.scoops === 0} onClick={moveOrderPhase}>
        Order Sundae!
      </Button>
    </div>
  );
}
