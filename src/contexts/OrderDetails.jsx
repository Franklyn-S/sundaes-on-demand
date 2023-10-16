import { createContext, useContext, useState } from "react";
import { pricePerItem } from "../constants";

const OrderDetails = createContext();

// create a custom hook to check whether we're inside a provider
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);
  if (!contextValue) {
    throw new Error("useOrderDetails must be used within an OrderDetailsProvider");
  }
  return contextValue;
}

export function OrderDetailsProvider(props) {
  const [orderPhase, setOrderPhase] = useState("entry");
  const [optionCounts, setOptionCounts] = useState({
    scoops: {}, // example{ Chocolate: 1, Vanilla: 2 }
    toppings: {}, // example: { "Gummi Bears": 1 }
  });

  function updateItemCount(itemName, newItemCount, optionType) {
    const newOptionCounts = { ...optionCounts };
    // update the copy with the new information
    newOptionCounts[optionType][itemName] = newItemCount;
    // update the state with the updated copy
    setOptionCounts(newOptionCounts);
  }

  function resetOrder() {
    setOptionCounts({ scoops: {}, toppings: {} });
  }

  function calculateTotal(optionType) {
    const countArray = Object.values(optionCounts[optionType]);
    const total = countArray.reduce((acc, curr) => acc + curr, 0);
    return total * pricePerItem[optionType];
  }

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value = {
    optionCounts,
    totals,
    orderPhase,

    updateItemCount,
    resetOrder,
    setOrderPhase,
  };
  return <OrderDetails.Provider value={value} {...props} />;
}
