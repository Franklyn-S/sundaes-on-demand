import Container from "react-bootstrap/Container";
import OrderEntry from "./pages/entry/OrderEntry";
import { useOrderDetails } from "./contexts/OrderDetails";
import OrderSummary from "./pages/summary/OrderSummary";
import OrderConfirmation from "./pages/orderConfirmation/OrderConfirmation";

function App() {
  const { orderPhase, setOrderPhase } = useOrderDetails();

  return (
    <Container>
      {orderPhase === "entry" && (
        <OrderEntry moveOrderPhase={() => setOrderPhase("review")} />
      )}
      {orderPhase === "review" && (
        <OrderSummary moveOrderPhase={() => setOrderPhase("confirmation")} />
      )}
      {orderPhase === "confirmation" && (
        <OrderConfirmation moveOrderPhase={() => setOrderPhase("entry")} />
      )}
    </Container>
  );
}

export default App;
