import axios from "axios";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useOrderDetails } from "../../contexts/OrderDetails";
import AlertBanner from "../common/AlertBanner";

const OrderConfirmation = ({ moveOrderPhase }) => {
  const [orderNumber, setOrderNumber] = useState();
  const [shouldShowErrorBanner, setShouldShowErrorBanner] = useState(false);
  const { resetOrder } = useOrderDetails();

  useEffect(() => {
    axios
      .post("http://localhost:3030/order")
      .then(response => {
        setOrderNumber(response.data.orderNumber);
      })
      .catch(() => {
        setShouldShowErrorBanner(true);
      });
  }, []);

  const handleClick = () => {
    resetOrder();
    moveOrderPhase();
  };

  const newOrderButton = <Button onClick={handleClick}>Create new order</Button>;
  if (shouldShowErrorBanner) {
    return (
      <>
        {shouldShowErrorBanner && <AlertBanner />}
        {newOrderButton}
      </>
    );
  }

  if (!orderNumber) {
    return <h2>Loading ...</h2>;
  }

  return (
    <Row>
      <h1>Thank you!</h1>
      <h2>Your order number is {orderNumber}</h2>
      <h3>As per our terms and conditions, nothing will happen now.</h3>
      {newOrderButton}
    </Row>
  );
};

export default OrderConfirmation;
